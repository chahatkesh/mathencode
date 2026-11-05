const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isCalendarDate(value: string) {
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function courseDateFromInput(value: string | null) {
  if (!value || !isCalendarDate(value)) return null;
  return new Date(`${value}T00:00:00.000Z`);
}

export function courseDateToInput(value?: Date | string | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export function formatCourseDate(value: string | null | undefined) {
  const iso = value?.slice(0, 10);
  if (!iso || !isCalendarDate(iso)) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function batchSizeLabel(batchSize: number) {
  return batchSize === 1
    ? "1 student per batch"
    : `${batchSize} students per batch`;
}

export function coursePublicDescription(course: {
  title: string;
  description?: string;
  startDate: string | null;
  topics: string[];
  batchSize: number;
}) {
  const written = course.description?.trim();
  if (written) return written;
  const size =
    course.batchSize === 1 ? "1 student" : `${course.batchSize} students`;
  const parts = [`${course.title} is taught live in small groups of ${size}.`];
  const start = formatCourseDate(course.startDate);
  if (start) parts.push(`The next batch starts ${start}.`);
  if (course.topics.length > 0) {
    parts.push(`Topics include ${course.topics.join(", ")}.`);
  }
  return parts.join(" ");
}
