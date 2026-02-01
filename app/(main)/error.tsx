"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-[80vh] flex-col items-center justify-center text-center p-6">
			<div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30 mb-6 animate-in zoom-in duration-500">
				<AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-500" />
			</div>

			<h2 className="text-3xl font-bold tracking-tight mb-2">
				Something went wrong!
			</h2>

			<p className="text-muted-foreground max-w-md mb-8">
				We apologize for the inconvenience. An unexpected error has occurred.
			</p>

			<div className="flex gap-4">
				<Button onClick={reset} variant="default" className="gap-2">
					<RefreshCw className="h-4 w-4" />
					Try again
				</Button>

				<Link href="/">
					<Button variant="outline" className="gap-2">
						<Home className="h-4 w-4" />
						Go Home
					</Button>
				</Link>
			</div>
		</div>
	);
}
