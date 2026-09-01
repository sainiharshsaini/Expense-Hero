"use client";

import { useEffect, useState } from "react";

export function DashboardGreeting({ userName }: { userName: string }) {
	const [greeting, setGreeting] = useState("Welcome");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const hour = new Date().getHours();
		const newGreeting =
			hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
		setGreeting(newGreeting);
		setMounted(true);
	}, []);

	if (!mounted) {
		return <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}</h1>;
	}

	return (
		<h1 className="text-3xl font-bold tracking-tight">
			{greeting}, {userName}
		</h1>
	);
}
