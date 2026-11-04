"use client";

import { useEffect, useState } from "react";
import { CircleHelp } from "lucide-react";
import ContactFormPopup from "~/components/features/contact-form-popup";

export function openDemoPopup() {
  window.dispatchEvent(new CustomEvent("openDemoPopup"));
}

export default function DemoHelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("openDemoPopup", open);
    return () => window.removeEventListener("openDemoPopup", open);
  }, []);

  return (
    <>
      {isOpen ? null : (
        <button
          type="button"
          onClick={openDemoPopup}
          aria-label="Book a free demo"
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white transition-colors hover:bg-secondary/90"
        >
          <CircleHelp className="h-6 w-6" />
        </button>
      )}
      <ContactFormPopup isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
