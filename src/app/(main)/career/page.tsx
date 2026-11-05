import Link from "next/link";
import JsonLd from "~/components/seo/json-ld";
import { jobs } from "~/data/jobs";
import { careerGraph, careerMetadata } from "~/lib/seo";

export const metadata = careerMetadata;

export default function CareerPage() {
  const countLabel =
    jobs.length === 1 ? "1 open role" : `${jobs.length} open roles`;

  return (
    <section className="bg-white pb-20 pt-[calc(var(--site-header)+2.5rem)]">
      <JsonLd data={careerGraph(jobs)} />
      <div className="container-custom">
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-dark md:text-5xl">
              Open roles
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-dark/65 md:text-lg">
              Live small-group math classes, with about 4–5 students in each
              batch. Choose a role to read the work and apply.
            </p>
          </div>
          <p className="text-sm font-medium text-dark/45">{countLabel}</p>
        </div>

        <ul className="mt-12 divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {jobs.map((job) => (
            <li key={job.slug}>
              <Link
                href={`/career/${job.slug}`}
                className="group flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-7"
              >
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold tracking-tight text-dark group-hover:text-secondary">
                    {job.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-dark/65">
                    {job.summary}
                  </p>
                  <p className="mt-2 text-sm text-dark/50">
                    {job.where}
                    <span aria-hidden className="px-1.5 text-dark/25">
                      ·
                    </span>
                    {job.hours}
                  </p>
                </div>
                <span className="inline-flex min-h-11 items-center text-sm font-semibold text-secondary">
                  View role
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
