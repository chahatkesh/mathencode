export type JobOpening = {
  slug: string;
  title: string;
  summary: string;
  where: string;
  hours: string;
  students: string;
  description: string;
  postedOn: string;
  work: { title: string; text: string }[];
  offer: { title: string; text: string }[];
};

export const jobs: JobOpening[] = [
  {
    slug: "math-tutor",
    title: "Math Tutor",
    summary: "Live small-group classes, with about 4–5 students in each batch.",
    where: "Remote",
    hours: "Flexible",
    students: "About 4–5 students",
    postedOn: "2026-11-04",
    description: "Teach a small batch, and stay with an idea until it sticks.",
    work: [
      {
        title: "A small batch",
        text: "Live classes of about 4–5 students. You teach the group in front of you.",
      },
      {
        title: "Until it sticks",
        text: "Stay with an idea until the batch can use it.",
      },
      {
        title: "Your subjects",
        text: "The math you know well, from algebra through AP calculus.",
      },
    ],
    offer: [
      {
        title: "Compensation",
        text: "Competitive pay for the classes you teach.",
      },
      { title: "Hours", text: "A flexible schedule you can keep." },
      { title: "Place", text: "Work from home. Classes are remote." },
      {
        title: "Support",
        text: "Professional development while you teach.",
      },
      { title: "Team", text: "A collaborative group of tutors." },
      {
        title: "Incentives",
        text: "Performance-based pay alongside the work.",
      },
    ],
  },
];

export function getJob(slug: string) {
  return jobs.find((job) => job.slug === slug);
}
