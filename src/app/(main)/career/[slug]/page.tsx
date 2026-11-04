import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JobApplicationForm from "~/components/features/job-application-form";
import SectionHeading from "~/components/layout/section-heading";
import JsonLd from "~/components/seo/json-ld";
import { getJob, jobs } from "~/data/jobs";
import { jobGraph, jobMetadata, missingMetadata } from "~/lib/seo";

type JobPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) {
    return missingMetadata(
      "Role",
      "This MathEncode role is not open.",
      `/career/${slug}`,
    );
  }
  return jobMetadata(job);
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const facts = [
    ["Role", job.title],
    ["Students", job.students],
    ["Where", job.where],
    ["Hours", job.hours],
  ];

  return (
    <div>
      <JsonLd data={jobGraph(job)} />
      <section className="bg-white pb-0 pt-[calc(var(--site-header)+2.5rem)]">
        <div className="container-custom">
          <Link
            href="/career"
            className="inline-flex min-h-11 items-center text-sm font-medium text-dark/50 hover:text-secondary"
          >
            All roles
          </Link>
          <h1 className="mt-2 max-w-2xl text-balance text-4xl font-semibold tracking-tight text-dark md:text-5xl">
            {job.title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-dark/65 md:text-lg">
            {job.description}
          </p>
          <dl className="mt-10 grid grid-cols-2 border-y border-black/[0.08] sm:grid-cols-4">
            {facts.map(([label, value]) => (
              <div key={label} className="min-w-0 py-5 sm:px-6 sm:first:pl-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-dark/40">
                  {label}
                </dt>
                <dd className="mt-2 break-words text-sm font-medium text-dark">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-custom grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              title="The work"
              subtitle="A class is one student and one idea, taught until it is clear."
            />
            <ol className="mt-10 space-y-8">
              {job.work.map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span className="w-7 shrink-0 text-sm font-semibold text-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-dark">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-dark/65">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading
              align="left"
              title="What you get"
              subtitle="How the teaching is set up."
            />
            <ul className="mt-10 divide-y divide-black/[0.08] border-y border-black/[0.08]">
              {job.offer.map((item) => (
                <li key={item.title} className="py-4">
                  <p className="text-sm font-semibold text-dark">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-dark/65">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="apply"
        className="scroll-mt-[var(--site-header)] bg-[#FFF7F2] py-16 md:py-24"
      >
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <SectionHeading
              align="left"
              title="Apply"
              subtitle={`Tell us what you teach and how you teach it. This application is for ${job.title}.`}
            />
            <div className="mt-8 rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8">
              <JobApplicationForm role={job.title} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
