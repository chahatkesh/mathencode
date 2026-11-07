"use client";

import { useId, useMemo, useRef, useState } from "react";
import { COUNTRY_CODES, type CountryOption } from "~/data/countries";
import { normalizePhoneInput } from "~/lib/phone-input";

const POPULAR_COUNTRIES = ["IN", "US", "GB", "AE", "CA", "AU", "SG"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  goals: string;
  expectations: string;
};

type FieldName = keyof FormState | "country";
type FieldErrors = Partial<Record<FieldName, string>>;

function phoneError(phone: string, countryCode: string) {
  if (!countryCode) return "Select your country first";
  if (!phone.trim()) return "Mobile number is required";
  if (phone.trim().startsWith("+"))
    return "Enter the number without the country code";
  const digits = phone.replace(/\D/g, "");
  const codeDigits = countryCode.replace(/\D/g, "");
  if (
    digits.length < 6 ||
    digits.length > 14 ||
    codeDigits.length + digits.length > 15
  ) {
    return "Enter a valid mobile number";
  }
  return undefined;
}

function validate(
  form: FormState,
  countryName: string,
  countryCode: string,
): FieldErrors {
  const errors: FieldErrors = {};
  const name = form.name.trim().replace(/\s+/g, " ");
  const email = form.email.trim();
  const goals = form.goals.trim();
  const expectations = form.expectations.trim();

  if (!name) errors.name = "Name is required";
  else if (!/^\p{L}[\p{L}\s.'-]{1,199}$/u.test(name))
    errors.name = "Enter your full name";

  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email";

  if (!countryName || !countryCode) errors.country = "Select your country";

  const phone = phoneError(form.phone, countryCode);
  if (phone) errors.phone = phone;

  if (!goals) errors.goals = "Tell us what you want to learn";
  else if (goals.length < 8)
    errors.goals = "Tell us a little more about what you want to learn";
  else if (goals.length > 2000) errors.goals = "Keep this to 2000 characters";

  if (!expectations) errors.expectations = "Tell us what you are hoping for";
  else if (expectations.length < 8)
    errors.expectations = "Tell us a little more about what you are hoping for";
  else if (expectations.length > 2000)
    errors.expectations = "Keep this to 2000 characters";

  return errors;
}

function matchCountry(value: string) {
  const needle = value.trim().toLowerCase();
  if (!needle) return null;
  return (
    COUNTRY_CODES.find((country) => country.name.toLowerCase() === needle) ??
    null
  );
}

export default function MentorshipRequestForm({
  sourceCourse = "",
}: {
  sourceCourse?: string;
}) {
  const uid = useId();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    goals: "",
    expectations: "",
  });
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const pickingCountry = useRef(false);

  const normalizedQuery = countryQuery.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!normalizedQuery) return [];
    return COUNTRY_CODES.filter(
      (country) =>
        country.name.toLowerCase().includes(normalizedQuery) ||
        country.code.includes(normalizedQuery),
    );
  }, [normalizedQuery]);
  const popular = useMemo(
    () =>
      POPULAR_COUNTRIES.map((id) =>
        COUNTRY_CODES.find((country) => country.country === id),
      ).filter((country): country is CountryOption => Boolean(country)),
    [],
  );
  const visible = normalizedQuery ? matches : popular;

  const selectCountry = (country: CountryOption) => {
    setCountryName(country.name);
    setCountryCode(country.code);
    setCountryQuery(country.name);
    setCountryOpen(false);
    window.setTimeout(() => {
      pickingCountry.current = false;
    }, 200);
    setErrors((current) => {
      if (!current.country && !current.phone) return current;
      const next = { ...current };
      delete next.country;
      if (next.phone === "Select your country first") delete next.phone;
      return next;
    });
  };

  const update =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "phone"
          ? normalizePhoneInput(event.target.value)
          : event.target.value;
      setForm((current) => ({ ...current, [field]: value }));
      setFormError(null);
      setErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    };

  const blur = (field: keyof FormState) => () => {
    const next = validate(form, countryName, countryCode)[field];
    setErrors((current) => {
      const copy = { ...current };
      if (next) copy[field] = next;
      else delete copy[field];
      return copy;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(form, countryName, countryCode);
    setErrors(nextErrors);
    const firstInvalid = (
      ["name", "email", "country", "phone", "goals", "expectations"] as const
    ).find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`${uid}-${firstInvalid}`)?.focus();
      return;
    }

    setLoading(true);
    setFormError(null);
    try {
      const response = await fetch("/api/mentorship-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          contactNumber: form.phone.trim(),
          countryCode,
          country: countryName,
          goals: form.goals.trim(),
          expectations: form.expectations.trim(),
          sourceCourse,
        }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setFormError(result.message || "Something went wrong. Try again.");
        return;
      }
      setSucceeded(true);
    } catch (error) {
      console.error("Error submitting mentorship request:", error);
      setFormError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (succeeded) {
    return (
      <div className="premium-success">
        <p className="public-eyebrow">Requested</p>
        <h3>We’ll be in touch</h3>
        <p>
          Your mentorship request is in. We’ll reply by email with a way to
          begin.
        </p>
      </div>
    );
  }

  const fieldClass = (invalid: boolean) =>
    `premium-input${invalid ? " premium-input--invalid" : ""}`;

  return (
    <form
      className="public-form premium-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {sourceCourse ? (
        <p className="premium-source">
          You were looking at <strong>{sourceCourse}</strong>. Say what you
          would change, or describe a different plan.
        </p>
      ) : null}

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
          maxLength={200}
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
          maxLength={200}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${uid}-email-error` : undefined}
          className={fieldClass(Boolean(errors.email))}
        />
      </Field>

      <Field id={`${uid}-country`} label="Country" error={errors.country}>
        <div className="premium-country">
          <input
            id={`${uid}-country`}
            type="text"
            name="country"
            role="combobox"
            autoComplete="country-name"
            aria-autocomplete="list"
            aria-expanded={countryOpen}
            aria-controls={`${uid}-country-list`}
            value={countryOpen ? countryQuery : countryName}
            onChange={(event) => {
              setCountryQuery(event.target.value);
              setCountryName("");
              setCountryCode("");
              setCountryOpen(true);
              setFormError(null);
              setErrors((current) => {
                if (!current.country) return current;
                const next = { ...current };
                delete next.country;
                return next;
              });
            }}
            onFocus={() => {
              setCountryQuery(countryName);
              setCountryOpen(true);
            }}
            onBlur={(event) => {
              const value = event.currentTarget.value;
              window.setTimeout(() => {
                if (pickingCountry.current) {
                  pickingCountry.current = false;
                  setCountryOpen(false);
                  return;
                }
                const match = matchCountry(value);
                if (match) {
                  selectCountry(match);
                  return;
                }
                setCountryOpen(false);
                setCountryName("");
                setCountryCode("");
                setErrors((current) => ({
                  ...current,
                  country: "Select your country",
                }));
              }, 150);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setCountryOpen(false);
                setCountryQuery(countryName);
                return;
              }
              if (event.key === "Enter" && countryOpen) {
                event.preventDefault();
                const first = visible[0];
                if (first) selectCountry(first);
              }
            }}
            placeholder="Start typing a country"
            aria-invalid={Boolean(errors.country)}
            aria-describedby={
              errors.country ? `${uid}-country-error` : undefined
            }
            className={fieldClass(Boolean(errors.country))}
          />
          {countryOpen ? (
            <ul
              id={`${uid}-country-list`}
              role="listbox"
              aria-label="Countries"
              className="premium-country-menu"
            >
              {!normalizedQuery ? (
                <li className="premium-country-label">Common</li>
              ) : null}
              {visible.length === 0 ? (
                <li className="premium-country-empty">No matching country</li>
              ) : (
                visible.map((country) => {
                  const selected = country.name === countryName;
                  return (
                    <li key={`${country.country}-${country.name}`}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className="premium-country-option"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          pickingCountry.current = true;
                        }}
                        onClick={() => selectCountry(country)}
                      >
                        <span>
                          <span aria-hidden="true">{country.flag}</span>{" "}
                          {country.name}
                        </span>
                        <span>{country.code}</span>
                      </button>
                    </li>
                  );
                })
              )}
              {!normalizedQuery ? (
                <li className="premium-country-empty">
                  Type to search every country.
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </Field>

      <Field id={`${uid}-phone`} label="Mobile number" error={errors.phone}>
        <div className="phone-field" data-invalid={Boolean(errors.phone)}>
          <span className="premium-dial" aria-hidden="true">
            {countryCode || "+"}
          </span>
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
              const sameCode = COUNTRY_CODES.filter(
                (option) => option.code === match.code,
              );
              const preferred =
                sameCode.find((option) => option.name === countryName) ??
                sameCode.find((option) =>
                  POPULAR_COUNTRIES.includes(option.country),
                ) ??
                match;
              selectCountry(preferred);
              setForm((current) => ({
                ...current,
                phone: digits.slice(match.code.length - 1),
              }));
              setErrors((current) => {
                const next = { ...current };
                delete next.phone;
                delete next.country;
                return next;
              });
              setFormError(null);
            }}
            onBlur={blur("phone")}
            placeholder="Mobile number"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={`${uid}-phone-hint${errors.phone ? ` ${uid}-phone-error` : ""}`}
            className="phone-number"
          />
        </div>
        <p id={`${uid}-phone-hint`} className="phone-hint">
          Choose your country, then enter the number without the country code.
        </p>
      </Field>

      <Field
        id={`${uid}-goals`}
        label="What do you want to learn?"
        error={errors.goals}
      >
        <textarea
          id={`${uid}-goals`}
          name="goals"
          rows={4}
          value={form.goals}
          onChange={update("goals")}
          onBlur={blur("goals")}
          maxLength={2000}
          placeholder="A topic, an exam, a grade, or something our courses do not cover"
          aria-invalid={Boolean(errors.goals)}
          aria-describedby={errors.goals ? `${uid}-goals-error` : undefined}
          className={fieldClass(Boolean(errors.goals))}
        />
      </Field>

      <Field
        id={`${uid}-expectations`}
        label="What are you hoping for?"
        error={errors.expectations}
      >
        <textarea
          id={`${uid}-expectations`}
          name="expectations"
          rows={4}
          value={form.expectations}
          onChange={update("expectations")}
          onBlur={blur("expectations")}
          maxLength={2000}
          placeholder="The pace, the result, or how you want the teaching to feel"
          aria-invalid={Boolean(errors.expectations)}
          aria-describedby={
            errors.expectations ? `${uid}-expectations-error` : undefined
          }
          className={fieldClass(Boolean(errors.expectations))}
        />
      </Field>

      {formError ? (
        <p role="alert" className="premium-form-error">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="public-button public-button--orange w-full"
      >
        {loading ? "Sending…" : "Request mentorship"}
      </button>
      <p className="premium-form-note">
        We’ll reply by email. No payment on this page.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="premium-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="premium-field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
