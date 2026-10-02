"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AlertIcon, ArrowRight, CheckIcon, WhatsAppIcon } from "@/components/ui/Icon";
import { site } from "@/config/site";
import { towns } from "@/content/coverage";
import { equipment } from "@/content/equipment";
import { pillars, servicesInPillar, serviceBySlug, type ServiceSlug } from "@/content/services";
import { whatsappHref } from "@/lib/contact";
import { onPrefill } from "@/lib/events";

type Values = {
  name: string;
  phone: string;
  email: string;
  service: string;
  equipment: string;
  location: string;
  message: string;
  reply: "call" | "whatsapp" | "email";
};

type Errors = Partial<Record<keyof Values, string>>;

const NOT_SURE = "not-sure";

const validate = (v: Values): Errors => {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter your name.";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 7) e.phone = "Enter a phone number Mayfair can reach you on.";
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Check the email address — it doesn’t look complete.";
  if (v.reply === "email" && !v.email) e.email = "Add an email address, or choose a different way to reply.";
  if (!v.service) e.service = "Choose the service you need, or “Not sure”.";
  return e;
};

const order: (keyof Values)[] = ["name", "phone", "email", "service", "location", "message"];

export function EnquiryForm({ defaultService }: { defaultService?: ServiceSlug }) {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const summaryRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<Values>({
    name: "",
    phone: "",
    email: "",
    service: defaultService ?? "",
    equipment: "",
    location: "",
    message: "",
    reply: "whatsapp",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  useEffect(
    () =>
      onPrefill(({ service, equipment: eq }) => {
        setValues((v) => ({ ...v, service: service ?? v.service, equipment: eq ?? v.equipment }));
        setStatus("idle");
        // Let the anchor scroll land, then put the cursor in the first field.
        window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 650);
      }),
    [],
  );

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    if (site.enquiry.mode === "endpoint" && site.enquiry.endpoint) {
      setStatus("sending");
      try {
        const res = await fetch(site.enquiry.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...values, source: window.location.href }),
        });
        setStatus(res.ok ? "sent" : "failed");
      } catch {
        setStatus("failed");
      }
      return;
    }
    setStatus("sent");
  };

  const serviceName =
    values.service === NOT_SURE ? "Not sure yet" : (serviceBySlug(values.service)?.name ?? values.service);

  const waMessage = [
    `Hello Mayfair, my name is ${values.name}.`,
    `I need: ${serviceName}${values.equipment ? ` (${values.equipment})` : ""}.`,
    values.location && `Location: ${values.location}.`,
    values.message,
  ]
    .filter(Boolean)
    .join("\n");

  if (status === "sent") {
    return (
      <div className="p-6 md:p-10" role="status" aria-live="polite">
        <div className="flex size-12 items-center justify-center bg-ochre text-ink">
          <CheckIcon size={24} />
        </div>
        <h3 className="display mt-6 text-5xl">{site.enquiry.mode === "demo" ? "Enquiry ready." : "Enquiry sent."}</h3>
        {site.enquiry.mode === "demo" ? (
          <p className="mt-4 max-w-md text-muted">
            <strong className="text-ink">Demo:</strong> nothing has been sent. On the live site this enquiry goes
            straight to Mayfair, with your details and the service you chose.
          </p>
        ) : (
          <p className="mt-4 max-w-md text-muted">
            Thanks, {values.name.split(" ")[0]}. Mayfair will get back to you by{" "}
            {values.reply === "call" ? "phone" : values.reply === "whatsapp" ? "WhatsApp" : "email"}.
          </p>
        )}
        <dl className="mt-8 grid gap-x-6 text-[0.9375rem] sm:grid-cols-2">
          {[
            ["Name", values.name],
            ["Phone", values.phone],
            ["Service", serviceName + (values.equipment ? ` — ${values.equipment}` : "")],
            ["Location", values.location || "—"],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-ink/12 py-2.5">
              <dt className="mono text-muted">{k}</dt>
              <dd className="mt-1 font-semibold break-words">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          {whatsappHref() && (
            <a href={whatsappHref(waMessage)!} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
              <WhatsAppIcon /> Also send on WhatsApp
            </a>
          )}
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setStatus("idle");
              setSubmitted(false);
              setValues((v) => ({ ...v, message: "", equipment: "" }));
            }}
          >
            Start another enquiry
          </button>
        </div>
      </div>
    );
  }

  const errorList = order.filter((k) => errors[k]);
  const describedBy = (f: keyof Values, hint?: boolean) =>
    [hint ? id(`${f}-hint`) : null, errors[f] ? id(`${f}-error`) : null].filter(Boolean).join(" ") || undefined;
  const fieldError = (f: keyof Values) =>
    errors[f] ? (
      <p id={id(`${f}-error`)} className="field-error">
        <AlertIcon className="mt-0.5 flex-none" /> {errors[f]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit} className="p-5 sm:p-6 md:p-10" aria-describedby={id("intro")}>
      <p id={id("intro")} className="sr-only">
        Fields marked required must be filled in.
      </p>

      {submitted && errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} className="mb-8 border-l-4 border-[#b42318] bg-[#fdf1ef] p-4 outline-none" role="alert">
          <p className="font-semibold text-[#8a1c12]">
            {errorList.length === 1 ? "One thing to fix" : `${errorList.length} things to fix`} before sending:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem]">
            {errorList.map((k) => (
              <li key={k}>
                <a href={`#${id(k)}`} className="underline underline-offset-2">
                  {errors[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={id("name")}>
            Name <span className="text-muted">(required)</span>
          </label>
          <input
            ref={nameRef}
            id={id("name")}
            className="input"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            required
          />
          {fieldError("name")}
        </div>

        <div className="field">
          <label htmlFor={id("phone")}>
            Phone <span className="text-muted">(required)</span>
          </label>
          <input
            id={id("phone")}
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+267"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            required
          />
          {fieldError("phone")}
        </div>

        <div className="field">
          <label htmlFor={id("service")}>
            Service <span className="text-muted">(required)</span>
          </label>
          <select
            id={id("service")}
            className="input"
            value={values.service}
            onChange={(e) => set("service", e.target.value)}
            aria-invalid={!!errors.service}
            aria-describedby={describedBy("service")}
            required
          >
            <option value="" disabled>
              Choose a service
            </option>
            {pillars.map((p) => (
              <optgroup key={p.id} label={`${p.number} ${p.name} — ${p.title}`}>
                {servicesInPillar(p.id).map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value={NOT_SURE}>Not sure / several things</option>
          </select>
          {fieldError("service")}
        </div>

        {values.service === "equipment-hire" && (
          <div className="field">
            <label htmlFor={id("equipment")}>Equipment</label>
            <select
              id={id("equipment")}
              className="input"
              value={values.equipment}
              onChange={(e) => set("equipment", e.target.value)}
            >
              <option value="">Choose equipment</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.singular}>
                  {eq.singular}
                </option>
              ))}
              <option value="Other equipment">Something else</option>
            </select>
          </div>
        )}

        <div className={`field ${values.service === "equipment-hire" ? "sm:col-span-2" : ""}`}>
          <label htmlFor={id("location")}>
            {values.service === "equipment-hire" ? "Where will it be used?" : "Project location"}
          </label>
          <input
            id={id("location")}
            className="input"
            list={id("towns")}
            autoComplete="address-level2"
            placeholder="Town or area"
            value={values.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <datalist id={id("towns")}>
          <option value="Gaborone" />
          {towns.map((t) => (
            <option key={t.name} value={t.name} />
          ))}
        </datalist>

        <div className="field sm:col-span-2">
          <label htmlFor={id("message")}>What do you need?</label>
          <span id={id("message-hint")} className="hint">
            Size, timing, anything useful. Photos can follow on WhatsApp.
          </span>
          <textarea
            id={id("message")}
            className="input"
            rows={4}
            maxLength={1500}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            aria-describedby={describedBy("message", true)}
          />
        </div>

        <fieldset className="field sm:col-span-2">
          <legend>How should Mayfair reply?</legend>
          <div className="segmented">
            {(
              [
                ["whatsapp", "WhatsApp"],
                ["call", "Call"],
                ["email", "Email"],
              ] as const
            ).map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name={id("reply")}
                  value={value}
                  checked={values.reply === value}
                  onChange={() => set("reply", value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field sm:col-span-2">
          <label htmlFor={id("email")}>
            Email <span className="text-muted">{values.reply === "email" ? "(required)" : "(optional)"}</span>
          </label>
          <input
            id={id("email")}
            className="input"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
          />
          {fieldError("email")}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-ink/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
        {site.enquiry.mode === "demo" ? (
          <p className="text-sm text-muted">
            <strong className="text-ink">Demo form.</strong> Nothing is sent from this preview.
          </p>
        ) : (
          <p className="text-sm text-muted">Mayfair replies using the method you choose.</p>
        )}
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry"} <ArrowRight />
        </button>
      </div>
      {status === "failed" && (
        <p className="field-error mt-4" role="alert">
          <AlertIcon className="mt-0.5 flex-none" /> The enquiry didn’t go through. Please try again, or call or WhatsApp
          Mayfair instead.
        </p>
      )}
    </form>
  );
}
