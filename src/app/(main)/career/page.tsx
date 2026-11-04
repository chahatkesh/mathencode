import Link from "next/link";
import JsonLd from "~/components/seo/json-ld";
import { jobs } from "~/data/jobs";
import { careerGraph, careerMetadata } from "~/lib/seo";

export const metadata = careerMetadata;

export default function CareerPage() {
  const countLabel =
    jobs.length === 1 ? "1 open role" : `${jobs.length} open roles`;

  return (
    <section className="bg-white pb-20 pt-28 md:pt-32">
      <JsonLd data={careerGraph(jobs)} />
      <div className="container-custom">
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-dark md:text-5xl">
              Open roles
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-dark/65 md:text-lg">
              Live, one-to-one math for grades K–12. Choose a role to read the
              work and apply.
            </p>
          </div>
          <p className="text-sm font-medium text-dark/45">{countLabel}</p>
        </div>

        <ul className="mt-12 divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {jobs.map((job) => (
            <li key={job.slug}>
              <Link
                href={`/career/${job.slug}`}
                className="group flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-7"
              >
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold tracking-tight text-dark group-hover:text-secondary">
                    {job.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-dark/65">
                    {job.summary}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-sm text-dark/50">
                  <span>{job.where}</span>
                  <span aria-hidden className="text-dark/25">
                    ·
                  </span>
                  <span>{job.hours}</span>
                  <span className="font-semibold text-secondary">
                    View role
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
