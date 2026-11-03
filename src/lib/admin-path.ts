/**
 * Guard admin return paths used after session expiry.
 * Only same-origin `/admin` routes are allowed.
 */
export function isSafeAdminReturnPath(value: string): boolean {
  if (!value.startsWith("/admin")) return false;
  if (value.startsWith("//") || value.includes("\\")) return false;

  let url: URL;
  try {
    url = new URL(value, "http://localhost");
  } catch {
    return false;
  }

  if (url.origin !== "http://localhost") return false;
  if (url.username || url.password) return false;

  const path = url.pathname;
  return path === "/admin" || path.startsWith("/admin/");
}
