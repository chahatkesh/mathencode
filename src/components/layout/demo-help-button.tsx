"use client";

import { useEffect, useState } from "react";
import { MessageCircleQuestionMark } from "lucide-react";
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
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-colors hover:bg-secondary/90"
        >
          <MessageCircleQuestionMark className="h-6 w-6" />
        </button>
      )}
      <ContactFormPopup isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
