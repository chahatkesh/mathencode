import type { ReactNode } from "react";

export default function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "center",
  as = "h2",
}: {
  title: ReactNode;
  subtitle: string;
  eyebrow?: string;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
}) {
  const Tag = as;
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow ? <p className="public-eyebrow">{eyebrow}</p> : null}
      <Tag className="public-title">{title}</Tag>
      <p className="public-lead">{subtitle}</p>
    </div>
  );
}
