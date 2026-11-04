export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  as = "h2",
}: {
  title: string;
  subtitle: string;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
}) {
  const Tag = as;
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <Tag className="text-balance text-3xl font-semibold tracking-tight text-dark md:text-4xl">
        {title}
      </Tag>
      <p className="mt-3 text-base leading-relaxed text-dark/65 md:text-lg">
        {subtitle}
      </p>
    </div>
  );
}
