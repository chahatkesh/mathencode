import type { Metadata } from "next";
import {
  CourseCard,
  CourseGuidance,
  PrivatePlanCard,
} from "~/components/features/courses";
import SectionHeading from "~/components/layout/section-heading";
import JsonLd from "~/components/seo/json-ld";
import { unavailableCatalog } from "~/lib/catalog-cache";
import { readHomeCatalog } from "~/lib/public-reads";
import { coursesMetadata, coursesPageGraph } from "~/lib/seo";

export const revalidate = 120;

export const metadata: Metadata = coursesMetadata;

export default async function CoursesPage() {
  const catalog = await readHomeCatalog();
  if (catalog.coursesUnavailable) return unavailableCatalog();

  return (
    <div className="courses-page">
      <JsonLd
        data={coursesPageGraph({
          courses: catalog.courses,
          hasCommonTest: catalog.hasCommonTest,
        })}
      />
      <section className="courses-catalog" aria-labelledby="courses-title">
        <div className="site-container">
          <SectionHeading
            as="h1"
            id="courses-title"
            align="left"
            title={
              <>
                Explore <span className="scribble">Courses</span>
              </>
            }
            subtitle="See what each course covers and when it starts."
          />
          {catalog.courses.length === 0 ? (
            <div className="public-empty-state">
              New courses will be listed here soon.
            </div>
          ) : null}
          <div className="course-grid course-grid--catalog">
            {catalog.courses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                priority={index < 3}
              />
            ))}
            <PrivatePlanCard />
          </div>
          <CourseGuidance
            id="diagnostic"
            heading="h2"
            titleId="diagnostic-title"
            href="/diagnostic/common"
            demoFallback={!catalog.hasCommonTest}
          />
        </div>
      </section>
    </div>
  );
}
