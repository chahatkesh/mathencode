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
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
};

export default nextConfig;
