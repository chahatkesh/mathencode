"use client";

import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { isValidPhoneInput, normalizePhoneInput } from "~/lib/phone-input";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type FormState = {
  name: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
};

type FieldName = keyof FormState;

const emptyForm: FormState = {
  name: "",
  email: "",
  contactNumber: "",
  subject: "",
  message: "",
};

function validate(form: FormState): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};

  if (!form.name.trim()) errors.name = "Name is required";
  else if (form.name.trim().length < 2)
    errors.name = "Use at least 2 characters";

  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email";

  if (!form.contactNumber.trim())
    errors.contactNumber = "Phone number is required";
  else if (!isValidPhoneInput(form.contactNumber))
    errors.contactNumber = "Enter a valid phone number";

  if (!form.subject.trim()) errors.subject = "Subject is required";
  if (!form.message.trim())
    errors.message = "Tell us a little about your teaching";

  return errors;
}

export default function JobApplicationForm({ role }: { role: string }) {
  const uid = useId();
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const successHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (succeeded) successHeading.current?.focus();
  }, [succeeded]);

  const update =
    (field: FieldName) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "contactNumber"
          ? normalizePhoneInput(event.target.value)
          : event.target.value;
      setFormData((current) => ({ ...current, [field]: value }));
      setFormError(null);
      setErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    };

  const blur = (field: FieldName) => () => {
    const message = validate(formData)[field];
    setErrors((current) => {
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    const firstInvalid = (
      ["name", "email", "contactNumber", "subject", "message"] as const
    ).find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`${uid}-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/submit-tutor-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          contactNumber: formData.contactNumber.trim(),
          subject: `${role} — ${formData.subject.trim()}`.slice(0, 200),
          message: `Applying for ${role}\n\n${formData.message.trim()}`,
        }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (result.success) {
        setSucceeded(true);
        setFormData(emptyForm);
      } else {
        setFormError(
          result.message || "The application could not be sent. Try again.",
        );
      }
    } catch (submitError) {
      console.error("Error submitting tutor application:", submitError);
      setFormError("Network error. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (succeeded) {
    return (
      <div className="application-success" role="status">
        <span className="application-success-icon" aria-hidden="true">
          <Check size={32} />
        </span>
        <p className="public-eyebrow">Received</p>
        <h3 ref={successHeading} tabIndex={-1}>
          Application received
        </h3>
        <p>We’ll read your {role} application and reply by email.</p>
        <button
          type="button"
          onClick={() => setSucceeded(false)}
          className="public-button public-button--outline"
        >
          Send another application
          <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form
      className="career-application-form"
      onSubmit={handleSubmit}
      aria-labelledby={`${uid}-form-title`}
      aria-busy={isSubmitting}
      noValidate
    >
      <div className="application-form-heading">
        <h3 id={`${uid}-form-title`}>Your application</h3>
        <p>All fields are required.</p>
      </div>
      <div className="application-field-row">
        <Field id={`${uid}-name`} label="Name" error={errors.name}>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={update("name")}
            onBlur={blur("name")}
            placeholder="Your name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className="application-input"
          />
        </Field>
        <Field id={`${uid}-email`} label="Email" error={errors.email}>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={update("email")}
            onBlur={blur("email")}
            placeholder="you@email.com"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className="application-input"
          />
        </Field>
      </div>

      <div className="application-field-row">
        <Field
          id={`${uid}-contactNumber`}
          label="Phone"
          error={errors.contactNumber}
        >
          <input
            id={`${uid}-contactNumber`}
            name="contactNumber"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={formData.contactNumber}
            onChange={update("contactNumber")}
            onBlur={blur("contactNumber")}
            placeholder="Phone number"
            required
            aria-invalid={Boolean(errors.contactNumber)}
            aria-describedby={
              errors.contactNumber ? `${uid}-contactNumber-error` : undefined
            }
            className="application-input"
          />
        </Field>
        <Field id={`${uid}-subject`} label="Subjects" error={errors.subject}>
          <input
            id={`${uid}-subject`}
            name="subject"
            type="text"
            value={formData.subject}
            onChange={update("subject")}
            onBlur={blur("subject")}
            placeholder="Algebra, calculus, SAT"
            required
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={
              errors.subject ? `${uid}-subject-error` : undefined
            }
            className="application-input"
          />
        </Field>
      </div>

      <Field
        id={`${uid}-message`}
        label="About your teaching"
        error={errors.message}
      >
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          value={formData.message}
          onChange={update("message")}
          onBlur={blur("message")}
          placeholder="Experience, qualifications, and why you want to teach here"
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${uid}-message-error` : undefined}
          className="application-input application-textarea"
        />
      </Field>

      {formError ? (
        <p role="alert" className="application-submit-error">
          {formError}
        </p>
      ) : null}

      <p className="application-privacy-note">
        See how we handle your information in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <button
        type="submit"
        disabled={isSubmitting}
        className="public-button public-button--orange application-submit"
      >
        {isSubmitting ? "Sending…" : "Submit application"}
        {isSubmitting ? (
          <LoaderCircle size={19} aria-hidden="true" />
        ) : (
          <ArrowUpRight size={19} aria-hidden="true" />
        )}
      </button>
      <span className="sr-only" role="status">
        {isSubmitting ? "Sending your application. Please wait." : ""}
      </span>
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
  children: ReactNode;
}) {
  return (
    <div className="application-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="application-field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
