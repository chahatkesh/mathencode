import Home from "~/components/features/home";
import JsonLd from "~/components/seo/json-ld";
import { getMarketingCourses } from "~/lib/courses";
import { hasPublishedCommonTest } from "~/lib/diagnostics";
import { homeGraph, homeMetadata } from "~/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = homeMetadata;

export default async function Page() {
  const [result, hasCommonTest] = await Promise.all([
    getMarketingCourses(),
    hasPublishedCommonTest(),
  ]);
  return (
    <>
      <JsonLd data={homeGraph({ courses: result.courses, hasCommonTest })} />
      <Home
        courses={result.courses}
        coursesUnavailable={!result.ok}
        hasCommonTest={hasCommonTest}
      />
    </>
  );
}
