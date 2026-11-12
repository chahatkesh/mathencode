"use client";

export function redirectIfExpired(
  response: Response,
  replace: (href: string) => void,
) {
  if (response.status !== 401 && response.status !== 403) return false;
  const params = new URLSearchParams({
    reason: "expired",
    from: `${window.location.pathname}${window.location.search}`,
  });
  replace(`/admin?${params.toString()}`);
  return true;
}
