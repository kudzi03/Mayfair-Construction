# Local search launch checklist

What has to happen, in order, to take the site from demo to a site that can win enquiries from Google Search and Maps in Gaborone. Everything technical is already built; what remains needs Mayfair's information or account access.

## 1. Information needed from Mayfair

Nothing below may be guessed. Each item goes into one file and flows through the whole site.

| Item | Where it goes | Why |
| --- | --- | --- |
| Business phone (E.164, e.g. `+26771234567`) | `site.contact.phone` | Call buttons, footer, JSON-LD, must match Google Business Profile (GBP) exactly |
| WhatsApp Business number | `site.contact.whatsapp` | WhatsApp buttons and pre-filled messages |
| Email address | `site.contact.email` | Email link, JSON-LD |
| Street address or yard — **only if customers visit it** | `site.contact.streetAddress` | Footer, JSON-LD. If customers never visit, leave it out and run GBP as a service-area business |
| Opening hours | `site.contact.hours` | Footer; GBP hours |
| Registered company name (CIPA) | `site.business.legalName` | JSON-LD `legalName` |
| Production domain (e.g. `mayfairconstruction.co.bw`) | `NEXT_PUBLIC_SITE_URL` | Canonicals, sitemap, social cards |
| Where enquiries should go (email inbox, CRM) | `NEXT_PUBLIC_ENQUIRY_ENDPOINT` | Turns on real form submission |
| Logo (SVG) | `public/` + `site.logo` | Header, JSON-LD `logo`, GBP logo |
| Credentials actually held: CIPA number, PPADB contractor code/grade, electrical contractor licence, any manufacturer approvals (ATM, EV chargers) | `content/trust.ts` → `credentials` | Banks and property managers check these before shortlisting |
| Real project photos per service, with permission | `src/assets/images/work/`, `content/projects.ts` | Replace labelled illustrations; strongest trust signal there is |
| Client testimonials with written permission | `content/trust.ts` → `testimonials` | Shown automatically once added |
| Clients that may be named (e.g. a bank, a mall) with permission | `content/trust.ts` → `clientNames` | "Worked for" line |
| Equipment fleet: capacities/sizes, quantity, delivery, operator offered or not, minimum hire period, deposit | `content/equipment.ts` → `specs` and `page` | Hire searchers compare on exactly this; a machine with specs + hire notes automatically gets its own page (`/equipment-hire/forklifts` etc.) |
| Which towns Mayfair will actually travel to, and any limits | `site.business.serviceArea`, GBP service area | Honest coverage |
| Facebook / LinkedIn pages | `site.social` | Footer, JSON-LD `sameAs` |

## 2. Google Business Profile setup

The profile drives Maps and the local pack; the website backs it up. Both must say the same thing.

1. Sign in at business.google.com with a Google account **Mayfair owns** (not a staff member's personal account). Add a second owner.
2. Business name: **Mayfair Construction** — exactly that, no keywords added (keyword-stuffed names get suspended).
3. Primary category: **General contractor**. Additional categories — pick only ones Mayfair truly offers, e.g. *Painter*, *Electrician*, *Roofing contractor* (waterproofing), *Equipment rental agency*, *Paving contractor*, *Carpet installer*. Check that each exists in GBP's list; don't add more than are justified.
4. Location: if customers do not visit an office or yard, choose **no** for "a location customers can visit" and set a **service area**: Gaborone plus the districts/towns Mayfair actually serves. If there is a visitable yard, enter the exact street address — and put the same address in `site.contact.streetAddress`.
5. Phone: the same number as `site.contact.phone`. Website: `https://<domain>/?utm_source=google&utm_medium=organic&utm_campaign=gbp` (the tag lets the CRM and analytics show GBP enquiries separately).
6. Hours: real hours only.
7. Description: paste `site.business.profileDescription` from `src/config/site.ts` (750-character limit; already written to match the site).
8. Services: add each service with the same names as the site (Restoration, Waterproofing, Painting, Electrical, Carpeting, Office Partitioning, Paving, ATM Installation, EV Charging Systems, Doors & Floor Springs, Joinery, Equipment Hire).
9. Photos: logo, a cover photo, and Mayfair's own job photos (the roof, paving, door and locker photos already on the site qualify). Never upload the AI illustrations.
10. Verify (video, phone or postcard — Google chooses). Do not change name/address/category while verification is pending.
11. After verification: put the public profile URL in `site.business.googleBusinessProfileUrl` (adds it to `sameAs`).
12. Ask the first real customers for reviews through the profile's "Ask for reviews" link. Reply to every review. Never post reviews yourselves or offer incentives.

Directories that already rank for Gaborone searches (worth a consistent free listing with the same name, phone and website): localbotswana.com, brabys.com/bw, yellowpages.bw, Facebook Page.

## 3. Search Console setup

1. Set `NEXT_PUBLIC_SITE_URL=https://<domain>` and `NEXT_PUBLIC_ALLOW_INDEXING=true`, set `NEXT_PUBLIC_DEMO_MODE=false` once real contact details are in, and redeploy. (The build refuses to enable indexing without a site URL.)
2. Check `https://<domain>/robots.txt` shows `Allow: /`, `Disallow: /crm` and the sitemap line, and `https://<domain>/sitemap.xml` lists 13 URLs on the production domain.
3. Go to search.google.com/search-console → Add property → **Domain** → add the TXT record at the domain's DNS host → Verify. (No DNS access? Use a URL-prefix property and set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the token from the HTML-tag method, then redeploy.)
4. Sitemaps → submit `sitemap.xml`.
5. URL Inspection → inspect `/`, `/painting`, `/office-partitioning`, `/equipment-hire` → "Request indexing".
6. Optional: Bing Webmaster Tools → import from Search Console (or set `NEXT_PUBLIC_BING_SITE_VERIFICATION`).
7. If a demo deployment (e.g. `*.vercel.app`) was ever public, it serves `noindex` by default; leave it that way or redirect it to the production domain.

## 4. Analytics

1. Create a GA4 property (time zone Africa/Gaborone, currency BWP). Either set `NEXT_PUBLIC_GA4_ID=G-…`, or create a GTM container and set `NEXT_PUBLIC_GTM_ID=GTM-…` instead (not both).
2. The site sends: `quote_form_start`, `quote_form_submit`, `phone_click`, `whatsapp_click`, `email_click`, each with `source` (where on the page) and `page_path`; form events also carry `service`.
   With GTM, create a GA4 event tag triggered on these custom events. With GA4 direct, they arrive automatically.
3. In GA4 mark `quote_form_submit`, `phone_click` and `whatsapp_click` as key events.
4. Link GA4 to Search Console.
5. Every enquiry also carries its landing page, referrer and UTM tags, so sources show in the CRM even without analytics.
6. Botswana's Data Protection Act applies to enquiry data and analytics cookies: publish a short privacy notice (what is collected, why, who to contact) before launch.

## 5. First 30 days after launch

- **Week 1:** GBP verified; Search Console sitemap submitted; key pages inspected; send a test enquiry from each service page and confirm it arrives and the GA4 events show in DebugView.
- **Week 1–2:** consistent listings on localbotswana, Brabys, yellowpages.bw and the Facebook Page (same name, phone, website).
- **Week 2:** add real job photos to GBP and to the matching service pages; ask 3–5 recent customers for Google reviews.
- **Week 3:** fill in equipment specs and hire terms — each machine then gets its own page and sitemap entry automatically.
- **Week 4:** in Search Console, check Pages (anything not indexed, and why) and Performance (which queries show impressions). Adjust page copy towards the wording people actually use; don't add pages without new, useful information.
- Ongoing: reply to every enquiry fast (speed decides most local jobs); post a GBP update with photos after each finished job.

## 6. Content worth adding later (only with real material)

Each service page already answers "what should I send for a quote". The next useful additions, once Mayfair can supply the facts:

- Office partitioning: how a job runs from floor plan to handover, typical lead time.
- Equipment hire: hire terms, delivery area, whether an operator is available.
- EV chargers: what's needed from the property (supply capacity, distance to the board), which charger brands Mayfair installs.
- Waterproofing: one documented roof job with before/after photos (photos already exist).

No blog until there is something real to say each month.

## 7. Claims deliberately not made

No years in business, project counts, ratings, reviews, prices, guarantees, response times, licences or named clients appear anywhere on the site or in structured data. Add them only when Mayfair confirms them.
