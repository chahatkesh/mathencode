import Home from "~/components/features/home";
import { getMarketingCourses } from "~/lib/courses";
import { hasPublishedCommonTest } from "~/lib/diagnostics";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [result, hasCommonTest] = await Promise.all([
    getMarketingCourses(),
    hasPublishedCommonTest(),
  ]);
  return (
    <Home
      courses={result.courses}
      coursesUnavailable={!result.ok}
      hasCommonTest={hasCommonTest}
    />
  );
}
