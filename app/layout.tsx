import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
});

export const metadata: Metadata = {
	title: {
		default: "ExpenseHero — Your AI-Powered Financial Guardian",
		template: "%s | ExpenseHero",
	},
	description:
		"ExpenseHero is a powerful, full-stack web application designed to help you track expenses, manage budgets, and gain insights into your financial health with ease.",
	keywords: [
		"expense tracker",
		"budget manager",
		"personal finance",
		"finance app",
		"dashboard",
		"analytics",
	],
	authors: [{ name: "ExpenseHero" }],
	creator: "ExpenseHero",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://expense-hero-harsh.vercel.app",
		title: "ExpenseHero — Your AI-Powered Financial Guardian",
		description:
			"ExpenseHero is a powerful, full-stack web application designed to help you track expenses, manage budgets, and gain insights into your financial health with ease.",
		siteName: "ExpenseHero",
	},
	twitter: {
		card: "summary_large_image",
		title: "ExpenseHero — Your AI-Powered Financial Guardian",
		description:
			"ExpenseHero is a powerful, full-stack web application designed to help you track expenses, manage budgets, and gain insights into your financial health with ease.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={`${outfit.variable} font-sans antialiased`}>
				<Toaster richColors />
				<main className="min-h-screen">{children}</main>
			</body>
		</html>
	);
}
