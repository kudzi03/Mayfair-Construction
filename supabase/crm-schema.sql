-- ============================================================================
-- Mayfair CRM — production schema (NOT deployed; the demo uses browser storage)
--
-- Smallest schema that does the job:
--   customers      one row per person/company (a customer can have many enquiries)
--   opportunities  one row per enquiry, carrying its own next follow-up
--   activities     the timeline
--   staff          who may sign in (Supabase Auth users)
--
-- Security model:
--   * RLS on every table. Only signed-in users listed in `staff` can read or
--     write anything. The anon role gets NO table access at all.
--   * The public website never touches these tables. Its form posts to a
--     Next.js server route, which validates the payload and calls
--     submit_enquiry() with the service-role key held in a server-only env var
--     (SUPABASE_SERVICE_ROLE_KEY — never NEXT_PUBLIC_*).
-- ============================================================================

create extension if not exists pgcrypto;

create table public.staff (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  role       text not null default 'staff' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);

create table public.customers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (length(trim(name)) between 2 and 120),
  company    text,
  phone      text,              -- stored E.164, e.g. +26771234567
  email      text,
  type       text not null default 'unknown'
             check (type in ('homeowner', 'property_manager', 'developer', 'company', 'bank', 'unknown')),
  created_at timestamptz not null default now()
);
create index customers_phone_idx on public.customers (phone);

create table public.opportunities (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid not null references public.customers (id) on delete restrict,
  service         text not null,   -- ids from src/crm/config.ts (SERVICES)
  title           text,
  location        text,
  source          text not null,   -- ids from src/crm/config.ts (SOURCES)
  stage           text not null default 'new'
                  check (stage in ('new', 'contacted', 'site_visit', 'quote_preparing', 'quote_sent', 'on_hold', 'won', 'lost')),
  value           numeric(14, 0) check (value is null or value >= 0),  -- BWP estimate
  received_at     timestamptz not null default now(),
  last_contact_at timestamptz,
  next_follow_up  date,
  next_action     text,
  assigned_to     uuid references public.staff (user_id) on delete set null,
  notes           text,
  closed_at       timestamptz,
  lost_reason     text,
  -- Attribution captured by the website (never guessed):
  landing_page    text,
  referrer        text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  created_at      timestamptz not null default now()
);
create index opportunities_follow_up_idx on public.opportunities (next_follow_up)
  where stage not in ('won', 'lost');
create index opportunities_customer_idx on public.opportunities (customer_id);

create table public.activities (
  id             uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  at             timestamptz not null default now(),
  type           text not null,
  text           text not null,
  created_by     uuid references public.staff (user_id) on delete set null
);
create index activities_opportunity_idx on public.activities (opportunity_id, at desc);

-- ---------------------------------------------------------------------------
-- Row level security: staff only.
-- ---------------------------------------------------------------------------
alter table public.staff         enable row level security;
alter table public.customers     enable row level security;
alter table public.opportunities enable row level security;
alter table public.activities    enable row level security;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated;

create policy "staff read staff"     on public.staff         for select to authenticated using (public.is_staff());
create policy "staff all customers"  on public.customers     for all    to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff all opps"       on public.opportunities for all    to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff all activities" on public.activities    for all    to authenticated using (public.is_staff()) with check (public.is_staff());
-- No policies for anon: the public cannot read or write any CRM table.

-- ---------------------------------------------------------------------------
-- Website enquiries: called only by the server route (service role).
-- Matches an existing customer by phone so repeat customers keep one record.
-- ---------------------------------------------------------------------------
create or replace function public.submit_enquiry(p jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_phone    text := nullif(regexp_replace(coalesce(p->>'phone', ''), '[^0-9+]', '', 'g'), '');
  v_customer uuid;
  v_opp      uuid;
begin
  if length(trim(coalesce(p->>'name', ''))) < 2 or v_phone is null then
    raise exception 'name and phone are required';
  end if;

  select id into v_customer from customers where phone = v_phone limit 1;
  if v_customer is null then
    insert into customers (name, phone, email)
    values (left(trim(p->>'name'), 120), v_phone, nullif(trim(p->>'email'), ''))
    returning id into v_customer;
  end if;

  insert into opportunities (customer_id, service, location, source, notes, next_follow_up, next_action,
                             landing_page, referrer, utm_source, utm_medium, utm_campaign)
  values (v_customer, coalesce(nullif(p->>'service', ''), 'other'), nullif(left(p->>'location', 200), ''),
          'website', nullif(left(p->>'message', 4000), ''), current_date, 'Contact customer',
          p->>'landing_page', p->>'referrer', p->>'utm_source', p->>'utm_medium', p->>'utm_campaign')
  returning id into v_opp;

  insert into activities (opportunity_id, type, text)
  values (v_opp, 'received', 'Enquiry received via the website form');

  return v_opp;
end;
$$;
revoke all on function public.submit_enquiry(jsonb) from public, anon, authenticated;
grant execute on function public.submit_enquiry(jsonb) to service_role;
