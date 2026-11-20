import { isCalendarDate } from "~/lib/course-format";

export const LAUNCH_DISMISS_STORAGE = "me-launch-dismissed";

// Runs before the header is parsed so a dismissed launch does not flash
// or shift the page. The course key stays in an attribute, not in this script.
export const LAUNCH_DISMISS_SCRIPT = `(function(){try{var root=document.currentScript&&document.currentScript.parentElement;if(!root)return;var key=root.getAttribute("data-launch");if(key&&localStorage.getItem(${JSON.stringify(LAUNCH_DISMISS_STORAGE)})===key)root.setAttribute("data-launch-dismissed","true")}catch(e){}})();`;

export type LaunchCandidate = {
  publicId: number;
  slug: string;
  title: string;
  startDate: string | null;
};

export type CourseLaunchItem = {
  key: string;
  href: string;
  title: string;
  when: string;
  sentence: string;
};

export type CourseLaunch = {
  key: string;
  items: CourseLaunchItem[];
};

function calendarDate(value: string | null | undefined) {
  const iso = value?.slice(0, 10) ?? "";
  return isCalendarDate(iso) ? iso : null;
}

function courseIdentity(course: { slug: string; publicId: number }) {
  return course.slug.trim() || String(course.publicId);
}

export function launchStorageKey(course: {
  slug: string;
  publicId: number;
  startDate: string;
}) {
  return `${courseIdentity(course)}:${course.startDate}`;
}

function formatPart(iso: string, month: "long" | "short", withYear: boolean) {
  const [year, monthIndex, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month,
    day: "numeric",
    ...(withYear ? { year: "numeric" as const } : {}),
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year!, monthIndex! - 1, day)));
}

export function utcToday(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function nextCourseLaunch(
  courses: LaunchCandidate[],
  todayIso: string,
): CourseLaunch | null {
  const today = calendarDate(todayIso);
  if (!today) return null;
  const todayYear = Number(today.slice(0, 4));

  const upcoming = courses
    .flatMap((course) => {
      const startDate = calendarDate(course.startDate);
      const title = course.title.trim();
      if (!startDate || !title || startDate < today) return [];
      return [{ ...course, title, startDate }];
    })
    .sort((a, b) => {
      if (a.startDate !== b.startDate)
        return a.startDate < b.startDate ? -1 : 1;
      return a.publicId - b.publicId;
    });

  if (upcoming.length === 0) return null;

  const items = upcoming.map((course) => {
    const withYear = Number(course.startDate.slice(0, 4)) !== todayYear;
    const longDate = formatPart(course.startDate, "long", withYear);
    const id = courseIdentity(course);
    return {
      key: launchStorageKey(course),
      href: `/course/${id}`,
      title: course.title,
      when: formatPart(course.startDate, "short", withYear),
      sentence: `${course.title} starts ${longDate}`,
    };
  });

  return {
    key: items.map((item) => item.key).join("|"),
    items,
  };
}
