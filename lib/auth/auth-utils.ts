import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const authRequired = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		console.log("Verify session in authRequired: No session, redirecting to /sign-in");
		redirect("/sign-in");
	}

	return session;
};

export const noAuthRequired = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) redirect("/");
};
