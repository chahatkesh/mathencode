"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import DemoRequestForm from "~/components/features/demo-request-form";

const ContactFormPopup = ({
  isOpen = false,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}) => {
  const titleId = useId();
  const closeTimer = useRef<number | null>(null);
  const close = useCallback(
    (open: boolean) => {
      setIsOpen?.(open);
    },
    [setIsOpen],
  );

  useEffect(() => {
    if (!isOpen) {
      if (closeTimer.current != null) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("[role='dialog'] input")?.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const handleSuccess = () => {
    if (closeTimer.current != null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => close(false), 2200);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-dark/45 p-3 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[min(92vh,720px)] w-full max-w-md overflow-y-auto rounded-2xl border border-black/[0.06] bg-white"
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-2 pt-6">
          <div>
            <h2
              id={titleId}
              className="text-2xl font-semibold tracking-tight text-dark"
            >
              Book a free demo
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-dark/65">
              A short note is enough. We’ll reply with a time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => close(false)}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-dark/55 hover:text-dark"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 pb-6 pt-4">
          <DemoRequestForm allowAnother={false} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default ContactFormPopup;
