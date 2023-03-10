/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "http://localhost:3000/",
      "http://localhost:8000/",
      "https://mercurius-backend.up.railway.app/",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;

