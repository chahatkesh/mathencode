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
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("[role='dialog'] input")?.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
      if (event.key !== "Tab") return;
      const focusable = [
        ...document.querySelectorAll<HTMLElement>(
          "[role='dialog'] button:not(:disabled), [role='dialog'] input, [role='dialog'] textarea, [role='dialog'] a[href], [data-country-menu] button, [data-country-menu] input",
        ),
      ].filter(
        (element) =>
          element.getClientRects().length > 0 && element.tabIndex >= 0,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      if (closeTimer.current != null) window.clearTimeout(closeTimer.current);
      if (previousFocus?.isConnected) previousFocus.focus();
      else document.querySelector<HTMLButtonElement>(".demo-help")?.focus();
    };
  }, [isOpen, close]);

  const handleSuccess = () => {
    if (closeTimer.current != null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => close(false), 2200);
  };

  if (!isOpen) return null;

  return (
    <div
      className="demo-overlay fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="demo-dialog max-h-[min(92dvh,760px)] w-full max-w-lg overflow-y-auto overscroll-contain border pb-[env(safe-area-inset-bottom)]"
      >
        <div className="demo-dialog-header sticky top-0 z-10 flex items-start justify-between gap-4 px-6 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8 sm:pt-8">
          <div>
            <h2
              id={titleId}
              className="text-balance text-2xl font-semibold tracking-tight text-dark"
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 text-dark/55 hover:text-dark"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 pb-8 pt-2 sm:px-8">
          <DemoRequestForm allowAnother={false} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default ContactFormPopup;
