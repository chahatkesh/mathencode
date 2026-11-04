export type JobOpening = {
  slug: string;
  title: string;
  summary: string;
  where: string;
  hours: string;
  students: string;
  description: string;
  work: { title: string; text: string }[];
  offer: { title: string; text: string }[];
};

export const jobs: JobOpening[] = [
  {
    slug: "math-tutor",
    title: "Math Tutor",
    summary: "Live, one-to-one classes for grades K–12.",
    where: "Remote",
    hours: "Flexible",
    students: "Grades K–12",
    description:
      "Teach one student at a time, and stay with an idea until it sticks.",
    work: [
      {
        title: "One student",
        text: "Live, one-to-one classes. You teach the person in front of you.",
      },
      {
        title: "Until it sticks",
        text: "Stay with an idea until the student can use it.",
      },
      {
        title: "Your subjects",
        text: "The math you know well, from the early grades through advanced courses.",
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
