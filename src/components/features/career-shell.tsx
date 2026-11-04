"use client";

import { useEffect, useState, type ReactNode } from "react";
import ContactFormPopup from "~/components/features/contact-form-popup";

export default function CareerShell({ children }: { children: ReactNode }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const openPopup = () => setIsPopupOpen(true);
    window.addEventListener("openDemoPopup", openPopup);
    return () => window.removeEventListener("openDemoPopup", openPopup);
  }, []);

  return (
    <>
      {children}
      <ContactFormPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
    </>
  );
}
