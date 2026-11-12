import {
  ArrowDown,
  ArrowUpRight,
  Clock3,
  Globe2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "~/components/seo/json-ld";
import { jobs } from "~/data/jobs";
import { careerGraph, careerMetadata } from "~/lib/seo";
import "~/styles/public-careers.css";

export const metadata = careerMetadata;

export default function CareerPage() {
  const countLabel =
    jobs.length === 1 ? "1 open role" : `${jobs.length} open roles`;

  return (
    <div className="careers-page">
      <JsonLd data={careerGraph(jobs)} />
      <section className="site-container careers-hero">
        <div className="careers-hero-copy">
          <p className="public-eyebrow">
            <Sparkles size={18} aria-hidden="true" /> Careers at MathEncode
          </p>
          <h1 className="public-display">
            Teach AP Math
            <br />
            <span className="careers-marker">with us.</span>
          </h1>
          <p className="public-lead careers-intro">
            Live classes in small cohorts, from algebra through AP Calculus.
            Open a role to read the work and apply.
          </p>
          <a href="#open-roles" className="public-button public-button--orange">
            Explore open roles <ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="careers-photo-scene">
          <span className="careers-photo-equation" aria-hidden="true">
            curiosity + clarity
          </span>
          <div className="careers-photo-frame">
            <Image
              src="/assets/learning/teaching.svg"
              alt="Illustration of a teacher leading a class"
              fill
              priority
              sizes="(max-width: 767px) 90vw, (max-width: 1279px) 45vw, 560px"
              className="careers-photo"
            />
          </div>
          <div className="careers-photo-note" aria-hidden="true">
            <Sparkles size={24} />
            <span>
              Live classes.
              <br />
              Small cohorts.
            </span>
          </div>
          <svg
            className="careers-photo-doodle"
            viewBox="0 0 110 100"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M16 15c45-3 80 13 71 39-8 23-48 16-46-6 1-14 22-16 29-4 13 21-5 40-36 43m0 0 13-16M34 87l20 1"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      <section id="open-roles" className="public-section careers-openings">
        <div className="site-container">
          <div className="careers-section-heading">
            <div>
              <p className="public-eyebrow">Now hiring</p>
              <h2 className="public-title">Open roles</h2>
            </div>
            <p className="public-pill careers-count">{countLabel}</p>
          </div>
          {jobs.length ? (
            <ul className="careers-role-list">
              {jobs.map((job) => (
                <li key={job.slug}>
                  <Link
                    href={`/career/${job.slug}`}
                    className="careers-role-card"
                  >
                    <div className="careers-role-copy">
                      <p className="careers-card-eyebrow">
                        Teaching · MathEncode
                      </p>
                      <h3>{job.title}</h3>
                      <p className="careers-role-summary">{job.summary}</p>
                      <ul
                        className="careers-role-tags"
                        aria-label="Role details"
                      >
                        <li>
                          <Globe2 size={16} aria-hidden="true" /> {job.where}
                        </li>
                        <li>
                          <Clock3 size={16} aria-hidden="true" /> {job.hours}
                        </li>
                      </ul>
                    </div>
                    <span className="careers-role-cta">
                      View role <ArrowUpRight size={20} aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="public-empty-state">
              <h3>No open roles right now</h3>
              <p>Check back here for future opportunities to teach with us.</p>
            </div>
          )}
          <p className="careers-closing-note">
            Live classes, in small cohorts, for AP mathematics.
          </p>
        </div>
      </section>
    </div>
  );
}
