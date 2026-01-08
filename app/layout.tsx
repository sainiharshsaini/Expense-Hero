import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import AppFooter from "@/components/custom/app-footer";
import AppHeader from "@/components/custom/app-header";

const inter = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Expense-Hero",
	description:
		"A full-stack web application to manage and track your personal finances easily.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={`${inter.className}`}>
				<AppHeader />
				<Toaster richColors />
				<main className="min-h-screen">{children}</main>
				<AppFooter />
			</body>
		</html>
	);
}
