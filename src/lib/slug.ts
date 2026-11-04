export const RESERVED_SLUGS = new Set([
  "common",
  "new",
  "admin",
  "api",
  "diagnostic",
  "course",
  "courses",
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugifyTitle(title: string) {
  const withoutNotes = title.replace(/\([^)]*\)/g, " ");
  return withoutNotes
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function slugIssue(slug: string) {
  if (!slug) return "URL name is required";
  if (slug.length < 2) return "URL name is too short";
  if (slug.length > 80) return "URL name is too long";
  if (!SLUG_PATTERN.test(slug)) {
    return "Use lowercase letters, numbers, and hyphens";
  }
  if (/^\d+$/.test(slug)) return "URL name cannot be only numbers";
  if (RESERVED_SLUGS.has(slug)) return "That URL name is reserved";
  return null;
}
