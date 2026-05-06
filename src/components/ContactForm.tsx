"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircleNotch, faTriangleExclamation, faArrowRight } from "@fortawesome/free-solid-svg-icons";

type FormState = {
  company: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  groupSize: string;
  date: string;
  altDate: string;
  location: string;
  honeypot: string; // bot trap
};

const INITIAL: FormState = {
  company: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  groupSize: "",
  date: "",
  altDate: "",
  location: "",
  honeypot: "",
};

// Locations exactly as specified (label = "Locatie X - Adres", value = "Locatie X - Adres")
const LOCATIONS = [
  { value: "", label: "Geen voorkeur" },
  { value: "Locatie Centrum - Nassaukade 351", label: "Locatie Centrum - Nassaukade 351" },
  { value: "Locatie Weesper - Schollenbrugstraat 1", label: "Locatie Weesper - Schollenbrugstraat 1" },
  { value: "Locatie Oost - Mauritskade 65", label: "Locatie Oost - Mauritskade 65" },
  { value: "Locatie Amstel - Mauritskade 1e", label: "Locatie Amstel - Mauritskade 1e" },
  { value: "Locatie Zuid - Stadionkade 73b", label: "Locatie Zuid - Stadionkade 73b" },
  { value: "Locatie De Pijp - Jozef Israëlskade", label: "Locatie De Pijp - Jozef Israëlskade" },
];

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

function isValidPhone(v: string) {
  // Strip non-digits, expect 9-15 digits (covers NL formats like +31 6 12 34 56 78)
  const digits = v.replace(/[^\d]/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function ContactForm() {
  const [state, setState] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!state.company.trim()) e.company = "Verplicht";
    if (!state.firstName.trim()) e.firstName = "Verplicht";
    if (!state.lastName.trim()) e.lastName = "Verplicht";
    if (!state.phone.trim()) e.phone = "Verplicht";
    else if (!isValidPhone(state.phone)) e.phone = "Geef een geldig telefoonnummer";
    if (!state.email.trim()) e.email = "Verplicht";
    else if (!isValidEmail(state.email)) e.email = "Geef een geldig e-mailadres";
    if (!state.groupSize.trim()) e.groupSize = "Verplicht";
    else {
      const n = Number(state.groupSize);
      if (!Number.isFinite(n) || n < 12) e.groupSize = "Minimaal 12 personen";
    }
    if (!state.date.trim()) e.date = "Verplicht";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (status === "submitting") return; // prevent double-submit
    if (!validate()) return;

    setStatus("submitting");
    setErrorMsg("");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Onbekende fout");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] bg-[color:var(--color-bg-warm)] border border-[color:var(--color-primary)]/8 p-8 md:p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
          <FontAwesomeIcon icon={faCheckCircle} className="text-3xl" />
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3">Aanvraag verzonden!</h3>
        <p className="text-[color:var(--color-primary)]/72 leading-relaxed max-w-md mx-auto">
          Je hoort binnen één werkdag van ons. We sturen ook een bevestiging naar{" "}
          <span className="font-medium text-[color:var(--color-primary)]">{state.email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form id="formulier" onSubmit={onSubmit} noValidate className="grid sm:grid-cols-2 gap-5">
      {/* Honeypot — invisible to humans, bots fill it in */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={state.honeypot}
        onChange={(e) => update("honeypot", e.target.value)}
        className="absolute left-[-9999px] w-px h-px opacity-0"
        aria-hidden="true"
      />

      <Field
        label="Bedrijfsnaam"
        required
        error={errors.company}
        className="sm:col-span-2"
        value={state.company}
        onChange={(v) => update("company", v)}
        autoComplete="organization"
      />

      <Field
        label="Voornaam"
        required
        error={errors.firstName}
        value={state.firstName}
        onChange={(v) => update("firstName", v)}
        autoComplete="given-name"
      />

      <Field
        label="Achternaam"
        required
        error={errors.lastName}
        value={state.lastName}
        onChange={(v) => update("lastName", v)}
        autoComplete="family-name"
      />

      <Field
        label="Telefoonnummer"
        type="tel"
        required
        error={errors.phone}
        value={state.phone}
        onChange={(v) => update("phone", v)}
        autoComplete="tel"
        placeholder="06 12 34 56 78"
      />

      <Field
        label="E-mail"
        type="email"
        required
        error={errors.email}
        value={state.email}
        onChange={(v) => update("email", v)}
        autoComplete="email"
        placeholder="naam@bedrijf.nl"
      />

      <Field
        label="Aantal personen"
        type="number"
        required
        error={errors.groupSize}
        value={state.groupSize}
        onChange={(v) => update("groupSize", v)}
        placeholder="Bijv. 75"
        min={12}
      />

      <Field
        label="Gewenste datum"
        type="date"
        required
        error={errors.date}
        value={state.date}
        onChange={(v) => update("date", v)}
      />

      <Field
        label="Alternatieve datum"
        type="date"
        error={errors.altDate}
        value={state.altDate}
        onChange={(v) => update("altDate", v)}
      />

      <SelectField
        label="Voorkeurlocatie"
        options={LOCATIONS}
        value={state.location}
        onChange={(v) => update("location", v)}
        className="sm:col-span-2"
      />

      <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-pill btn-primary inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? (
            <>
              <FontAwesomeIcon icon={faCircleNotch} spin />
              <span>Versturen…</span>
            </>
          ) : (
            <>
              <span>Verstuur je aanvraag</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </>
          )}
        </button>
        <p className="text-xs text-[color:var(--color-muted)] max-w-xs">
          We bewaren je gegevens alleen voor deze aanvraag en delen ze nooit met derden.
        </p>
      </div>

      {status === "error" && (
        <div className="sm:col-span-2 flex items-start gap-3 rounded-[var(--radius-card)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Er ging iets mis. Probeer het opnieuw of bel ons direct.</p>
            {errorMsg && <p className="text-xs text-red-700/75 mt-1">{errorMsg}</p>}
          </div>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  required = false,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className = "",
  autoComplete,
  min,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  autoComplete?: string;
  min?: number;
}) {
  const baseInputClass =
    "w-full bg-white border rounded-xl px-4 py-3.5 font-medium text-[color:var(--color-primary)] placeholder-[color:var(--color-muted)]/60 focus:outline-none focus:ring-2 transition-all";
  const okBorder = "border-[color:var(--color-primary)]/15 focus:border-[color:var(--color-accent)] focus:ring-[color:var(--color-accent)]/20";
  const errBorder = "border-red-400 focus:border-red-500 focus:ring-red-300/40";

  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
        {label}
        {required && <span className="text-[color:var(--color-accent)] ml-1">*</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        className={`${baseInputClass} ${error ? errBorder : okBorder}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
      />
      {error && (
        <span id={`${label}-error`} className="text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </label>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
  required = false,
  className = "",
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
        {label}
        {required && <span className="text-[color:var(--color-accent)] ml-1">*</span>}
      </span>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-[color:var(--color-primary)]/15 rounded-xl px-4 py-3.5 font-medium text-[color:var(--color-primary)] focus:outline-none focus:border-[color:var(--color-accent)] focus:ring-2 focus:ring-[color:var(--color-accent)]/20 transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
