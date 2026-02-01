import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
	"/dashboard",
	"/account",
	"/transaction",
	"/profile",
	"/analytics",
];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isProtected = PROTECTED_PATHS.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`),
	);

	if (!isProtected) {
		return NextResponse.next();
	}

	// Check for Better Auth session cookie
	// Better Auth stores session in cookies - check common cookie names
	const cookies = request.cookies;
	const hasSessionCookie =
		cookies.has("better-auth.session_token") ||
		cookies.has("better-auth.session") ||
		cookies.has("session") ||
		// Check if any cookie starts with better-auth
		Array.from(cookies.getAll()).some((cookie) =>
			cookie.name.startsWith("better-auth"),
		);

	if (!hasSessionCookie) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

// Configure which routes this proxy runs on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
