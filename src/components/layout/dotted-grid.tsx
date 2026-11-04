export default function DottedGrid({ size = 22 }: { size?: 22 | 28 }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.26)_1px,transparent_1.2px)] ${
        size === 28 ? "bg-[length:28px_28px]" : "bg-[length:22px_22px]"
      }`}
    />
  );
}
