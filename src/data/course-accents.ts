import type { CourseAccent, CourseColorScheme } from "~/types";

export const COURSE_ACCENTS = [
  "primary",
  "secondary",
  "purple",
  "accent",
  "orange",
] as const satisfies readonly CourseAccent[];

export const ACCENT_LABELS: Record<CourseAccent, string> = {
  primary: "Slate",
  secondary: "Orange",
  purple: "Purple",
  accent: "Amber",
  orange: "Bright orange",
};

export const COLOR_SCHEMES: Record<CourseAccent, CourseColorScheme> = {
  primary: {
    gradient: "from-primary to-bright-blue",
    accent: "primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
  },
  secondary: {
    gradient: "from-secondary to-orange",
    accent: "secondary",
    bg: "bg-secondary/5",
    border: "border-secondary/20",
  },
  purple: {
    gradient: "from-purple to-purple/80",
    accent: "purple",
    bg: "bg-purple/5",
    border: "border-purple/20",
  },
  accent: {
    gradient: "from-accent to-bright-yellow",
    accent: "accent",
    bg: "bg-accent/5",
    border: "border-accent/20",
  },
  orange: {
    gradient: "from-orange to-secondary",
    accent: "orange",
    bg: "bg-orange/5",
    border: "border-orange/20",
  },
};

export function colorSchemeForAccent(accent: CourseAccent): CourseColorScheme {
  return COLOR_SCHEMES[accent];
}
