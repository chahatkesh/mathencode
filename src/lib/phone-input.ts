export function normalizePhoneInput(value: string): string {
  return value
    .replace(/[^\d+()\s-]/g, "")
    .replace(/\s+/g, " ")
    .trimStart()
    .replace(/(?!^)\+/g, "");
}

export function isValidPhoneInput(value: string, countryCode = ""): boolean {
  if (!/^\+?[\d()\s-]+$/.test(value.trim())) return false;
  if (countryCode && value.trim().startsWith("+")) return false;
  const digits = value.replace(/\D/g, "");
  const prefix = countryCode.replace(/\D/g, "");
  return digits.length >= 7 && digits.length + prefix.length <= 15;
}
