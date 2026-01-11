import { BarChart3, LayoutDashboard, PenBox } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { Button } from "../ui/button";
import Image from "next/image";
import expenseHeroLogo from "@/public/Expense_Hero.png";
import { MobileNav } from "./mobile-nav";
import { UserAvatarDropdown } from "./user-avatar-dropdown";

const AppHeader = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const isAuthenticated = !!session;

	return (
		<header className="fixed top-0 w-full z-50 animate-in fade-in slide-in-from-top duration-700">
			<nav className="mx-auto my-6 w-[92%] md:max-w-7xl rounded-full px-4 md:px-8 py-3 
				bg-background/40 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20 
				flex items-center justify-between transition-all duration-300 hover:border-white/20">

				<Link href="/" className="relative block h-10 w-32 md:h-12 md:w-40 transition-transform hover:scale-105 active:scale-95">
					<Image
						src={expenseHeroLogo}
						alt="Expense Hero Logo"
						fill
						priority
						sizes="160px"
						className="object-contain object-left drop-shadow-md"
					/>
				</Link>

				<div className="hidden md:flex items-center gap-1">
					{isAuthenticated ? (
						<>
							<Link href="/dashboard">
								<Button
									variant="ghost"
									className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full px-6 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
								>
									<LayoutDashboard size={14} className="mr-2 opacity-70" />
									Dashboard
								</Button>
							</Link>

							<Link href="/analytics">
								<Button
									variant="ghost"
									className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full px-6 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
								>
									<BarChart3 size={14} className="mr-2 opacity-70" />
									Analytics
								</Button>
							</Link>

							<div className="h-6 w-px bg-white/10 mx-2" />

							<Link href="/transaction/create">
								<Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 px-6 font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95">
									<PenBox size={14} className="mr-2" />
									Add Trx
								</Button>
							</Link>

							<UserAvatarDropdown
								user={{
									name: session.user.name,
									email: session.user.email,
									image: session.user.image,
								}}
							/>
						</>
					) : (
						<>
							<Link href="/sign-in">
								<Button
									variant="ghost"
									className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full px-6 font-black text-[10px] uppercase tracking-[0.2em]"
								>
									Log In
								</Button>
							</Link>

							<Link href="/sign-up">
								<Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 px-8 font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95">
									Get Started
								</Button>
							</Link>
						</>
					)}
				</div>

				<MobileNav isAuthenticated={isAuthenticated} />
			</nav>
		</header>
	);
};

export default AppHeader;
