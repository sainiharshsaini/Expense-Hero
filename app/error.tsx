"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
			<h1 className="text-4xl font-bold gradient-title mb-4">
				Something went wrong!
			</h1>
			<p className="text-gray-600 mb-8 max-w-md">
				We apologize for the inconvenience. An unexpected error occurred while
				processing your request.
			</p>
			<Button onClick={() => reset()} size="lg">
				Try again
			</Button>
		</div>
	);
}
