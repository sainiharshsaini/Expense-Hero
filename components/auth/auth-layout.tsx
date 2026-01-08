import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import expenseHeroLogo from "@/public/Expense_Hero.png";

const AuthLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<div className="w-full flex items-center justify-center">
				<Link href="/" className="relative block h-16 w-60">
					<Image
						src={expenseHeroLogo}
						alt="Expense Hero Logo"
						fill
						priority // Ensures the logo loads immediately (best for SEO/LCP)
						className="object-cover object-center"
					/>
				</Link>
				</div>
				{children}
			</div>
		</div>
	);
};

export default AuthLayout;
