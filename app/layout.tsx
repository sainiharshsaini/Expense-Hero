import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AppFooter from "@/components/custom/app-footer";
import AppHeader from "@/components/custom/app-header";

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
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
			<body className={`${outfit.variable} font-sans antialiased`}>
				<AppHeader />
				<Toaster richColors />
				<main className="min-h-screen">{children}</main>
				<AppFooter />
			</body>
		</html>
	);
}
