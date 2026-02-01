import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import expenseHeroLogo from "@/public/Expense_Hero.png";

const AuthLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="relative flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10 overflow-hidden">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-background to-background" />
			<div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

			<div className="flex w-full max-w-sm flex-col gap-6 z-10">{children}</div>
		</div>
	);
};

export default AuthLayout;
