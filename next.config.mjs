/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse (via pdfjs-dist) dynamically resolves its worker file at
  // runtime; letting webpack bundle it breaks that resolution inside
  // Next.js API routes. Keep it external so Node loads it natively.
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
};

export default nextConfig;
