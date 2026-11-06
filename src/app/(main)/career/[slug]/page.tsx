import { ArrowLeft, ArrowUpRight, Check, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JobApplicationForm from "~/components/features/job-application-form";
import JsonLd from "~/components/seo/json-ld";
import { getJob, jobs } from "~/data/jobs";
import { jobGraph, jobMetadata, missingMetadata } from "~/lib/seo";
import "~/styles/public-careers.css";

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
    ["Batch", job.students],
    ["Where", job.where],
    ["Hours", job.hours],
  ];

  return (
    <div className="careers-page">
      <JsonLd data={jobGraph(job)} />
      <section className="site-container career-detail-hero">
        <Link href="/career" className="careers-back-link">
          <ArrowLeft size={17} aria-hidden="true" /> All roles
        </Link>
        <div className="career-detail-intro">
          <div>
            <p className="public-eyebrow">Teach with MathEncode</p>
            <h1 className="public-display">{job.title}</h1>
            <p className="public-lead">{job.description}</p>
            <a href="#apply" className="public-button public-button--orange">
              Apply for this role <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          </div>
          <div className="career-detail-photo">
            <Image
              src="/assets/learning/learning-moment.jpg"
              alt="A student focused on learning"
              fill
              priority
              sizes="(max-width: 767px) 90vw, (max-width: 1279px) 38vw, 440px"
              className="careers-photo"
            />
            <span className="career-detail-photo-caption" aria-hidden="true">
              <Sparkles size={20} /> That “I get it!” moment.
            </span>
          </div>
        </div>
        <dl className="career-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="public-section career-work-section">
        <div className="site-container career-work-grid">
          <div>
            <p className="public-eyebrow">A little about the role</p>
            <h2 className="public-title">The work</h2>
            <p className="career-section-intro">
              A class is a small batch and one idea, taught until it is clear.
            </p>
            <ol className="career-work-list">
              {job.work.map((item, index) => (
                <li key={item.title}>
                  <span className="career-work-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="career-offer-panel">
            <p className="public-eyebrow">Room to do your best</p>
            <h2 className="public-title">What you get</h2>
            <p className="career-section-intro">How the teaching is set up.</p>
            <ul className="career-offer-list">
              {job.offer.map((item) => (
                <li key={item.title}>
                  <span className="career-offer-check" aria-hidden="true">
                    <Check size={16} />
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="apply" className="public-section career-application-section">
        <div className="site-container career-application-grid">
          <div className="career-application-intro">
            <span className="career-application-spark" aria-hidden="true">
              ✳
            </span>
            <p className="public-eyebrow">Let’s make it click</p>
            <h2 className="public-title">Apply</h2>
            <p className="public-lead">
              Tell us what you teach and how you teach it. This application is
              for {job.title}.
            </p>
            <p className="career-application-note">
              A little about you.
              <br />A lot of possibility.
            </p>
          </div>
          <div className="career-form-panel">
            <JobApplicationForm role={job.title} />
          </div>
        </div>
      </section>
    </div>
  );
}
