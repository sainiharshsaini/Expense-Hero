import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
	"/dashboard",
	"/account",
	"/transaction",
	"/profile",
	"/analytics",
];

export async function middleware(request: NextRequest) {
	const { pathname, origin } = request.nextUrl;

	const isProtected = PROTECTED_PATHS.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`),
	);

	if (!isProtected) {
		return NextResponse.next();
	}

	const cookies = request.cookies;

	const sessionToken =
		cookies.get("better-auth.session_token")?.value ||
		cookies.get("__Secure-better-auth.session_token")?.value ||
		cookies.get("__Host-better-auth.session_token")?.value;

	const hasSessionCookie =
		!!sessionToken ||
		cookies.getAll().some((cookie) => cookie.name.startsWith("better-auth"));

	if (!hasSessionCookie) {
		const signInUrl = new URL("/sign-in", origin);

		signInUrl.searchParams.set("callbackUrl", pathname);

		return NextResponse.redirect(signInUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)",
	],
};
