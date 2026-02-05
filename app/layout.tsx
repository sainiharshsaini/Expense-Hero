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
	title: {
		default: "Expense-Hero - Your Financial Guardian",
		template: "%s | Expense-Hero",
	},
	description:
		"Expense-Hero is a powerful, full-stack web application designed to help you track expenses, manage budgets, and gain insights into your financial health with ease.",
	keywords: [
		"expense tracker",
		"budget manager",
		"personal finance",
		"finance app",
		"dashboard",
		"analytics",
	],
	authors: [{ name: "Harsh" }],
	creator: "Harsh",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://expense-hero-harsh.vercel.app", // Assuming this is the URL from earlier
		title: "Expense-Hero - Your Financial Guardian",
		description:
			"Expense-Hero is a powerful, full-stack web application designed to help you track expenses, manage budgets, and gain insights into your financial health with ease.",
		siteName: "Expense-Hero",
	},
	twitter: {
		card: "summary_large_image",
		title: "Expense-Hero - Your Financial Guardian",
		description:
			"Expense-Hero is a powerful, full-stack web application designed to help you track expenses, manage budgets, and gain insights into your financial health with ease.",
	},
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
