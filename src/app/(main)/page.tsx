import Home from "~/components/features/home";
import JsonLd from "~/components/seo/json-ld";
import { readHomeCatalog } from "~/lib/public-reads";
import { homeGraph, homeMetadata } from "~/lib/seo";

// Stay dynamic so a build without MongoDB cannot freeze an empty catalog.
// Course data itself is cached in readHomeCatalog.
export const dynamic = "force-dynamic";

export const metadata = homeMetadata;

export default async function Page() {
  const catalog = await readHomeCatalog();
  return (
    <>
      <JsonLd
        data={homeGraph({
          courses: catalog.courses,
          hasCommonTest: catalog.hasCommonTest,
        })}
      />
      <Home
        courses={catalog.courses}
        coursesUnavailable={catalog.coursesUnavailable}
      />
    </>
  );
}
