import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../prisma";

const baseURL =
	process.env.BETTER_AUTH_URL ||
	process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
	(process.env.NODE_ENV === "production"
		? process.env.NEXT_PUBLIC_APP_URL ||
			(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
		: "http://localhost:3000");

const trustedOrigins =
	process.env.NODE_ENV === "production"
		? ([
				process.env.BETTER_AUTH_URL,
				process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
				process.env.NEXT_PUBLIC_APP_URL,
				process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
			].filter(Boolean) as string[])
		: (["http://localhost:3000", "http://127.0.0.1:3000", baseURL].filter(
				Boolean,
			) as string[]);

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
const googleProvider =
	googleClientId && googleClientSecret
		? {
				google: {
					clientId: googleClientId,
					clientSecret: googleClientSecret,
					prompt: "select_account" as const,
				},
			}
		: {};

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	baseURL,
	basePath: "/api/auth",
	trustedOrigins,
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	socialProviders: googleProvider,
});
