/** @type {import('next').NextConfig} */

const nextConfig = {
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
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
