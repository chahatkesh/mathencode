"use client";

export function openDemoPopup() {
  window.dispatchEvent(new CustomEvent("openDemoPopup"));
}

export function BookDemoButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={openDemoPopup} className={className}>
      {children}
    </button>
  );
}
