"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";

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
  const digits = form.contactNumber.replace(/\D/g, "");

  if (!form.name.trim()) errors.name = "Name is required";
  else if (form.name.trim().length < 2)
    errors.name = "Use at least 2 characters";

  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email";

  if (!form.contactNumber.trim())
    errors.contactNumber = "Phone number is required";
  else if (digits.length < 7 || digits.length > 15)
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

  const update =
    (field: FieldName) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
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

  const fieldClass = (invalid: boolean) =>
    `w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-dark outline-none transition-colors placeholder:text-dark/35 focus:border-secondary ${
      invalid ? "border-red-400" : "border-black/10"
    }`;

  if (succeeded) {
    return (
      <div className="py-8 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary">
          Received
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-dark">
          Application received
        </h3>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-dark/65">
          We’ll read your {role} application and reply by email.
        </p>
        <button
          type="button"
          onClick={() => setSucceeded(false)}
          className="mt-6 text-sm font-semibold text-secondary"
        >
          Send another application
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            aria-invalid={Boolean(errors.name)}
            className={fieldClass(Boolean(errors.name))}
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
            aria-invalid={Boolean(errors.email)}
            className={fieldClass(Boolean(errors.email))}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            aria-invalid={Boolean(errors.contactNumber)}
            className={fieldClass(Boolean(errors.contactNumber))}
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
            aria-invalid={Boolean(errors.subject)}
            className={fieldClass(Boolean(errors.subject))}
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
          aria-invalid={Boolean(errors.message)}
          className={`${fieldClass(Boolean(errors.message))} resize-none`}
        />
      </Field>

      {formError ? (
        <p role="alert" className="text-sm text-red-600">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-secondary px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Sending…" : "Submit application"}
      </button>
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
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-dark"
      >
        {label}
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
