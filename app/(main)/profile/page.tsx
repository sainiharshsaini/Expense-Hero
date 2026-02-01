import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import ProfileClient from "./_components/ProfileClient";

export default async function ProfilePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	return (
		<div className="space-y-10 px-4 py-8 animate-in fade-in duration-700">
			<ProfileClient user={session.user} />
		</div>
	);
}
