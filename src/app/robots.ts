import type { MetadataRoute } from "next";
import { absoluteUrl, allowIndexing, siteHost } from "~/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/g7xv2m9qz5b4", "/g7xv2m7yterfi"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteHost(),
  };
}
