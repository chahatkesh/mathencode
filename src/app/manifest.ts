import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "~/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "en",
    icons: [
      {
        src: "/favicon.png",
        sizes: "400x400",
        type: "image/png",
      },
    ],
  };
}
