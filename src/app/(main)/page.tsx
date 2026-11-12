import Home from "~/components/features/home";
import JsonLd from "~/components/seo/json-ld";
import { unavailableCatalog } from "~/lib/catalog-cache";
import { readHomeCatalog } from "~/lib/public-reads";
import { homeGraph, homeMetadata } from "~/lib/seo";

// Cached at the edge and refreshed at least every two minutes.
// Admin edits clear it immediately through revalidatePublicCatalog.
export const revalidate = 120;

export const metadata = homeMetadata;

export default async function Page() {
  const catalog = await readHomeCatalog();
  if (catalog.coursesUnavailable) return unavailableCatalog();
  return (
    <>
      <JsonLd
        data={homeGraph({
          courses: catalog.courses,
          hasCommonTest: catalog.hasCommonTest,
        })}
      />
      <Home courses={catalog.courses} hasCommonTest={catalog.hasCommonTest} />
    </>
  );
}
