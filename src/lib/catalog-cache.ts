import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { connection } from "next/server";

export const PUBLIC_CATALOG_TAG = "public-catalog";

// Page files repeat this as `export const revalidate = 120`. Next.js only
// accepts a literal there, so it cannot import this constant.
export const PUBLIC_CATALOG_REVALIDATE_SECONDS = 120;

export function revalidatePublicCatalog() {
  revalidateTag(PUBLIC_CATALOG_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/course/[id]", "page");
  revalidatePath("/diagnostic/[id]", "page");
  revalidatePath("/sitemap.xml");
}

/**
 * A failed catalog read must not be stored as a successful empty page.
 * During a build with no database, postpone the route instead of failing
 * the build or prerendering the failure. At request time, throw so
 * revalidation keeps the last good page.
 */
export async function unavailableCatalog(): Promise<never> {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    await connection();
  }
  throw new Error("Catalog unavailable");
}
