/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/about",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=1, stale-while-revalidate=59",
          },
        ],
      },
    ];
  },
  images: {
    domains: ["crests.football-data.org", "upload.wikimedia.org"],
  },
};

export default nextConfig;
