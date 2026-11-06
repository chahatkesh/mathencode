"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { isValidPhoneInput, normalizePhoneInput } from "~/lib/phone-input";
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

function validate(form: FormState, countryCode = ""): FieldErrors {
  const errors: FieldErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();

  if (!name) errors.name = "Name is required";
  else if (name.length < 2) errors.name = "Use at least 2 characters";

  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email";

  if (!form.phone.trim()) errors.phone = "Phone number is required";
  else if (!isValidPhoneInput(form.phone, countryCode))
    errors.phone = "Enter a valid phone number without the country code";

  return errors;
}

function CountryMenu({
  id,
  selectedId,
  onSelect,
  onClose,
}: {
  id: string;
  selectedId: string;
  onSelect: (country: CountryOption) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [focusedId, setFocusedId] = useState(selectedId);
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
        tabIndex={country.country === focusedId ? 0 : -1}
        onFocus={() => setFocusedId(country.country)}
        onClick={() => choose(country)}
        className="country-option"
      >
        <span className="text-base leading-none" aria-hidden>
          {country.flag}
        </span>
        <span className="w-12 shrink-0 font-medium">{country.code}</span>
        <span className="min-w-0 flex-1 text-dark/80">{country.name}</span>
        {selected ? <Check size={16} aria-hidden className="shrink-0" /> : null}
      </button>
    );
  };

  return (
    <div
      ref={panelRef}
      className="country-menu-panel"
      onKeyDown={(event) => {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))
          return;
        if (
          event.target === searchRef.current &&
          ["Home", "End"].includes(event.key)
        )
          return;
        const options = [
          ...(panelRef.current?.querySelectorAll<HTMLButtonElement>(
            "[role='option']",
          ) ?? []),
        ];
        if (!options.length) return;
        event.preventDefault();
        const index = options.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? options.length - 1
              : event.key === "ArrowDown"
                ? (index + 1) % options.length
                : index <= 0
                  ? options.length - 1
                  : index - 1;
        options[next]?.focus();
        options[next]?.scrollIntoView({ block: "nearest" });
      }}
    >
      <div className="country-search">
        <Search size={17} aria-hidden />
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
          aria-controls={id}
          className="w-full rounded-lg border border-black/10 py-2.5 pl-9 pr-3 text-sm text-dark"
        />
      </div>
      <div
        id={id}
        role="listbox"
        aria-label="Countries"
        className="country-menu-options"
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
    maxHeight: number;
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
      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const width = Math.min(360, viewportWidth - 24);
      const left = Math.min(
        Math.max(viewportLeft + 12, rect.left),
        viewportLeft + viewportWidth - width - 12,
      );
      const above = Math.max(0, rect.top - viewportTop - 20);
      const below = Math.max(
        0,
        viewportTop + viewportHeight - rect.bottom - 20,
      );
      const openAbove = below < Math.min(300, above);
      const maxHeight = Math.min(320, openAbove ? above : below);
      const top = openAbove ? rect.top - maxHeight - 8 : rect.bottom + 8;
      setMenuStyle({ top, left, width, maxHeight });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.visualViewport?.removeEventListener("resize", place);
      window.visualViewport?.removeEventListener("scroll", place);
    };
  }, [menuOpen]);

  const update =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "phone"
          ? normalizePhoneInput(event.target.value)
          : event.target.value;
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
    const next = validate(form, country?.code)[field];
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
    const nextErrors = validate(form, country?.code);
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
    <form className="public-form space-y-5" onSubmit={handleSubmit} noValidate>
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
        <div className="phone-field" data-invalid={Boolean(errors.phone)}>
          <button
            ref={triggerRef}
            type="button"
            data-country-trigger
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? `${uid}-countries` : undefined}
            aria-label={`Country code ${country?.name ?? ""} ${country?.code ?? ""}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.currentTarget.focus();
              setMenuOpen((open) => !open);
            }}
            className="phone-country-trigger"
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
            onPaste={(event) => {
              const pasted = event.clipboardData.getData("text").trim();
              if (!pasted.startsWith("+")) return;
              const digits = pasted.replace(/\D/g, "");
              const match = [...COUNTRY_CODES]
                .sort((a, b) => b.code.length - a.code.length)
                .find((option) => digits.startsWith(option.code.slice(1)));
              if (!match) return;
              event.preventDefault();
              if (country?.code !== match.code) {
                const preferred = POPULAR_COUNTRIES.find((id) =>
                  COUNTRY_CODES.some(
                    (option) =>
                      option.country === id && option.code === match.code,
                  ),
                );
                setCountryId(preferred ?? match.country);
              }
              setForm((current) => ({
                ...current,
                phone: digits.slice(match.code.length - 1),
              }));
              setErrors((current) => ({ ...current, phone: undefined }));
              setFormError(null);
            }}
            onBlur={blur("phone")}
            placeholder="Phone number"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={`${uid}-phone-hint${errors.phone ? ` ${uid}-phone-error` : ""}`}
            className="phone-number"
          />
        </div>
        <p id={`${uid}-phone-hint`} className="phone-hint">
          Choose your country, then enter your number.
        </p>
      </Field>

      <Field id={`${uid}-message`} label="Note" optional>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={3}
          value={form.message}
          onChange={update("message")}
          placeholder="Course, topic, or anything we should know"
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
        className="public-button public-button--orange w-full"
      >
        {loading ? "Sending…" : "Book a free demo"}
      </button>
      <p className="text-center text-xs text-dark/45">
        We’ll reply by email. No spam.
      </p>

      {menuOpen && menuStyle && country
        ? createPortal(
            <div
              data-country-menu
              style={{
                position: "fixed",
                top: menuStyle.top,
                left: menuStyle.left,
                width: menuStyle.width,
                maxHeight: menuStyle.maxHeight,
                zIndex: 80,
              }}
            >
              <CountryMenu
                id={`${uid}-countries`}
                selectedId={country.country}
                onSelect={(next) => setCountryId(next.country)}
                onClose={() => {
                  setMenuOpen(false);
                  triggerRef.current?.focus();
                }}
              />
            </div>,
            document.querySelector("[role='dialog']") ??
              document.querySelector(".public-site") ??
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
