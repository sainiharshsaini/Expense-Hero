import { BarChart3, LayoutDashboard, PenBox } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { Button } from "../ui/button";
import { MobileNav } from "./mobile-nav";
import { UserAvatarDropdown } from "./user-avatar-dropdown";

const AppHeader = async () => {
	const session = await auth.api.getSession({ headers: await headers() });
	const isAuthenticated = !!session;

	return (
		<header className="fixed top-0 z-50 w-full border-b bg-background">
			<nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:px-8">
				<Link href="/" className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
						EH
					</div>
					<div className="flex flex-col leading-none">
						<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
							Expense
						</span>
						<span className="text-sm font-bold uppercase tracking-[0.16em] text-foreground">
							Hero
						</span>
					</div>
				</Link>

				<div className="hidden items-center gap-1 md:flex">
					{isAuthenticated ? (
						<>
							<Link href="/dashboard">
								<Button
									variant="ghost"
									className="rounded-md px-3 text-sm font-medium"
								>
									<LayoutDashboard size={14} className="mr-2" />
									Dashboard
								</Button>
							</Link>
							<Link href="/analytics">
								<Button
									variant="ghost"
									className="rounded-md px-3 text-sm font-medium"
								>
									<BarChart3 size={14} className="mr-2" />
									Analytics
								</Button>
							</Link>
							<div className="mx-2 h-6 w-px bg-border" />
							<Link href="/transaction/create">
								<Button className="rounded-md px-4 text-sm font-medium">
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
									className="rounded-md px-3 text-sm font-medium"
								>
									Log In
								</Button>
							</Link>
							<Link href="/sign-up">
								<Button className="rounded-md px-4 text-sm font-medium">
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
