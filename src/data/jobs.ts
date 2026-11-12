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
    summary: "Live small-group classes for AP math preparation.",
    where: "Remote",
    hours: "Flexible",
    students: "Small cohort",
    postedOn: "2026-11-04",
    description:
      "Teach AP mathematics live, in a small cohort, from algebra through AP Calculus.",
    work: [
      {
        title: "A small cohort",
        text: "Live classes in a small cohort. You teach the group in front of you.",
      },
      {
        title: "Until students can use it",
        text: "Stay with a topic until the cohort can apply it.",
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
