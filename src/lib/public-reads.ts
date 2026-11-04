import "server-only";
import { unstable_cache } from "next/cache";
import { PUBLIC_CATALOG_TAG } from "~/lib/catalog-cache";
import { getMarketingCourses, getPublicCourse } from "~/lib/courses";
import {
  getCommonDiagnosticPage,
  getDiagnosticPage,
  hasPublishedCommonTest,
} from "~/lib/diagnostics";
import type { MarketingCourse } from "~/types";

const CATALOG_REVALIDATE_SECONDS = 120;

async function readHomeCatalogUncached() {
  const [result, hasCommonTest] = await Promise.all([
    getMarketingCourses(),
    hasPublishedCommonTest(),
  ]);
  if (!result.ok) throw new Error("Marketing catalog unavailable");
  return { courses: result.courses, hasCommonTest };
}

const loadHomeCatalog = unstable_cache(
  readHomeCatalogUncached,
  ["home-catalog"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [PUBLIC_CATALOG_TAG] },
);

export async function readHomeCatalog(): Promise<{
  courses: MarketingCourse[];
  coursesUnavailable: boolean;
  hasCommonTest: boolean;
}> {
  try {
    const catalog = await loadHomeCatalog();
    return { ...catalog, coursesUnavailable: false };
  } catch (error) {
    console.error("Failed to load home catalog", error);
    return { courses: [], coursesUnavailable: true, hasCommonTest: false };
  }
}

const loadPublicCourse = unstable_cache(
  async (param: string) => {
    const result = await getPublicCourse(param);
    if (result.status === "error") throw new Error("Course unavailable");
    return result;
  },
  ["public-course"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [PUBLIC_CATALOG_TAG] },
);

export async function readPublicCourse(param: string) {
  try {
    return await loadPublicCourse(param);
  } catch (error) {
    console.error("Failed to load course", error);
    return { status: "error" as const };
  }
}

const loadDiagnosticPage = unstable_cache(
  async (param: string) => {
    const result = await getDiagnosticPage(param);
    if (result.status === "error") throw new Error("Diagnostic unavailable");
    return result;
  },
  ["diagnostic-page"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [PUBLIC_CATALOG_TAG] },
);

export async function readDiagnosticPage(param: string) {
  try {
    return await loadDiagnosticPage(param);
  } catch (error) {
    console.error("Failed to load diagnostic test", error);
    return { status: "error" as const };
  }
}

const loadCommonDiagnosticPage = unstable_cache(
  async () => {
    const result = await getCommonDiagnosticPage();
    if (result.status === "error") {
      throw new Error("Common diagnostic unavailable");
    }
    return result;
  },
  ["common-diagnostic"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [PUBLIC_CATALOG_TAG] },
);

export async function readCommonDiagnosticPage() {
  try {
    return await loadCommonDiagnosticPage();
  } catch (error) {
    console.error("Failed to load common diagnostic test", error);
    return { status: "error" as const };
  }
}
