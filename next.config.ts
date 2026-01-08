import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: false,
	experimental: {
		serverActions: {
			bodySizeLimit: "5mb",
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "randomuser.me",
				pathname: "/api/portraits/**",
			},
		],
	},
};

export default nextConfig;
