/** @type {import('next').NextConfig} */

const nextConfig = {
  agentRules: false,
  outputFileTracingIncludes: {
    "/*": ["./src/assets/og/**/*"],
    "/course/**": ["./src/assets/og/**/*"],
    "/diagnostic/**": ["./src/assets/og/**/*"],
    "/career/**": ["./src/assets/og/**/*"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
  },
  headers: async () => [
    {
      source: "/:all*(svg|png|jpg|jpeg|webp|avif|ico|mp4)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, stale-while-revalidate=604800",
        },
      ],
    },
  ],
  redirects: async () => {
    return [
      {
        source: "/g7xv2m9qz5b4",
        destination: "/admin/submissions",
        permanent: false,
      },
      {
        source: "/g7xv2m7yterfi",
        destination: "/admin/applications",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
