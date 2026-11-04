"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { COUNTRY_CODES, type CountryOption } from "~/data/countries";

const POPULAR_COUNTRIES = ["IN", "US", "GB", "AE", "CA", "AU", "SG"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FieldName = "name" | "email" | "phone";
type FieldErrors = Partial<Record<FieldName, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const digits = form.phone.replace(/\D/g, "");

  if (!name) errors.name = "Name is required";
  else if (name.length < 2) errors.name = "Use at least 2 characters";

  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email";

  if (!form.phone.trim()) errors.phone = "Phone number is required";
  else if (digits.length < 7 || digits.length > 15)
    errors.phone = "Enter a valid phone number";

  return errors;
}

function CountryMenu({
  selectedId,
  onSelect,
  onClose,
}: {
  selectedId: string;
  onSelect: (country: CountryOption) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const normalized = query.trim().toLowerCase();
  const matches = COUNTRY_CODES.filter(
    (country) =>
      !normalized ||
      country.name.toLowerCase().includes(normalized) ||
      country.code.includes(normalized) ||
      country.country.toLowerCase().includes(normalized),
  );
  const popular = POPULAR_COUNTRIES.map((id) =>
    COUNTRY_CODES.find((country) => country.country === id),
  ).filter((country): country is CountryOption => Boolean(country));
  const rest = COUNTRY_CODES.filter(
    (country) => !POPULAR_COUNTRIES.includes(country.country),
  );

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-country-trigger]"))
        return;
      onClose();
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [onClose]);

  const choose = (country: CountryOption) => {
    onSelect(country);
    onClose();
  };

  const renderOption = (country: CountryOption) => {
    const selected = country.country === selectedId;
    return (
      <button
        key={`${country.country}-${country.code}`}
        type="button"
        role="option"
        aria-selected={selected}
        onClick={() => choose(country)}
        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm ${
          selected
            ? "bg-secondary/10 text-dark"
            : "text-dark hover:bg-black/[0.03]"
        }`}
      >
        <span className="text-base leading-none" aria-hidden>
          {country.flag}
        </span>
        <span className="w-12 shrink-0 font-medium">{country.code}</span>
        <span className="min-w-0 flex-1 truncate text-dark/70">
          {country.name}
        </span>
      </button>
    );
  };

  return (
    <div
      ref={panelRef}
      className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg"
    >
      <div className="border-b border-black/[0.06] p-2">
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              const first = normalized ? matches[0] : popular[0];
              if (first) choose(first);
            }
          }}
          placeholder="Search countries"
          aria-label="Search countries"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-dark outline-none placeholder:text-dark/35 focus:border-secondary"
        />
      </div>
      <div
        role="listbox"
        aria-label="Countries"
        className="max-h-56 overflow-y-auto"
      >
        {normalized ? (
          matches.length > 0 ? (
            matches.map(renderOption)
          ) : (
            <p className="px-3 py-6 text-center text-sm text-dark/50">
              No countries match “{query.trim()}”
            </p>
          )
        ) : (
          <>
            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-dark/40">
              Common
            </p>
            {popular.map(renderOption)}
            <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-dark/40">
              All countries
            </p>
            {rest.map(renderOption)}
          </>
        )}
      </div>
    </div>
  );
}

export default function DemoRequestForm({
  onSuccess,
  allowAnother = true,
}: {
  onSuccess?: () => void;
  allowAnother?: boolean;
}) {
  const uid = useId();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [countryId, setCountryId] = useState("US");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const country =
    COUNTRY_CODES.find((item) => item.country === countryId) ??
    COUNTRY_CODES.find((item) => item.country === "US") ??
    COUNTRY_CODES[0];

  useEffect(() => {
    if (!menuOpen) return;
    const place = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(320, window.innerWidth - 24);
      const left = Math.min(
        Math.max(12, rect.left),
        window.innerWidth - width - 12,
      );
      const below = rect.bottom + 8;
      const menuHeight = 280;
      const top =
        below + menuHeight > window.innerHeight - 12 && rect.top > menuHeight
          ? rect.top - menuHeight - 8
          : below;
      setMenuStyle({ top, left, width });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [menuOpen]);

  const update =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((current) => ({ ...current, [field]: value }));
      setFormError(null);
      if (field === "message") return;
      setErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    };

  const blur = (field: FieldName) => () => {
    const next = validate({ ...form })[field];
    setErrors((current) => {
      const copy = { ...current };
      if (next) copy[field] = next;
      else delete copy[field];
      return copy;
    });
  };

  const reset = () => {
    setForm({ name: "", email: "", phone: "", message: "" });
    setCountryId("US");
    setErrors({});
    setFormError(null);
    setSucceeded(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    const firstInvalid = (["name", "email", "phone"] as const).find(
      (field) => nextErrors[field],
    );
    if (firstInvalid) {
      document.getElementById(`${uid}-${firstInvalid}`)?.focus();
      return;
    }
    if (!country) return;

    setLoading(true);
    setFormError(null);
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          contactNumber: `${country.code} ${form.phone.trim()}`,
          countryCode: country.code,
          message: form.message.trim() || "No message provided",
        }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setFormError(result.message || "Something went wrong. Try again.");
        return;
      }
      setSucceeded(true);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (succeeded) {
    return (
      <div className="py-8 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary">
          Requested
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-dark">
          We’ll be in touch
        </h3>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-dark/65">
          Your demo request is in. We’ll reply by email to set a time.
        </p>
        {allowAnother ? (
          <button
            type="button"
            onClick={reset}
            className="mt-6 text-sm font-semibold text-secondary"
          >
            Send another request
          </button>
        ) : null}
      </div>
    );
  }

  const fieldClass = (invalid: boolean, shape = "w-full rounded-xl") =>
    `${shape} border bg-white px-3.5 py-3 text-sm text-dark outline-none transition-colors placeholder:text-dark/35 focus:border-secondary ${
      invalid ? "border-red-400" : "border-black/10"
    }`;

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <Field id={`${uid}-name`} label="Name" error={errors.name}>
        <input
          id={`${uid}-name`}
          type="text"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={update("name")}
          onBlur={blur("name")}
          placeholder="Your name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${uid}-name-error` : undefined}
          className={fieldClass(Boolean(errors.name))}
        />
      </Field>

      <Field id={`${uid}-email`} label="Email" error={errors.email}>
        <input
          id={`${uid}-email`}
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          onBlur={blur("email")}
          placeholder="you@email.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${uid}-email-error` : undefined}
          className={fieldClass(Boolean(errors.email))}
        />
      </Field>

      <Field id={`${uid}-phone`} label="Phone" error={errors.phone}>
        <div className="flex">
          <button
            ref={triggerRef}
            type="button"
            data-country-trigger
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            aria-label={`Country code ${country?.name ?? ""} ${country?.code ?? ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex shrink-0 items-center gap-1.5 rounded-l-xl border border-r-0 bg-white px-3 py-3 text-sm text-dark ${
              errors.phone ? "border-red-400" : "border-black/10"
            }`}
          >
            <span aria-hidden>{country?.flag}</span>
            <span className="font-medium">{country?.code}</span>
            <ChevronDown className="h-3.5 w-3.5 text-dark/40" aria-hidden />
          </button>
          <input
            id={`${uid}-phone`}
            type="tel"
            name="phone"
            autoComplete="tel-national"
            inputMode="tel"
            value={form.phone}
            onChange={update("phone")}
            onBlur={blur("phone")}
            placeholder="Phone number"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
            className={fieldClass(
              Boolean(errors.phone),
              "min-w-0 flex-1 rounded-r-xl",
            )}
          />
        </div>
      </Field>

      <Field id={`${uid}-message`} label="Note" optional>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={3}
          value={form.message}
          onChange={update("message")}
          placeholder="Grade, topic, or anything we should know"
          className={`${fieldClass(false)} resize-none`}
        />
      </Field>

      {formError ? (
        <p role="alert" className="text-sm text-red-600">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-secondary px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Sending…" : "Book a free demo"}
      </button>
      <p className="text-center text-xs text-dark/45">
        We’ll reply by email. No spam.
      </p>

      {menuOpen && menuStyle && country
        ? createPortal(
            <div
              style={{
                position: "fixed",
                top: menuStyle.top,
                left: menuStyle.left,
                width: menuStyle.width,
                zIndex: 80,
              }}
            >
              <CountryMenu
                selectedId={country.country}
                onSelect={(next) => setCountryId(next.country)}
                onClose={() => setMenuOpen(false)}
              />
            </div>,
            document.body,
          )
        : null}
    </form>
  );
}

function Field({
  id,
  label,
  optional = false,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-baseline gap-2 text-sm font-medium text-dark"
      >
        {label}
        {optional ? (
          <span className="text-xs font-normal text-dark/40">Optional</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
