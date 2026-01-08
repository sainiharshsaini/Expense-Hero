import { LayoutDashboard, PenBox } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import LogoutBtn from "../auth/logout-btn";
import { Button } from "../ui/button";

const AppHeader = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const isAuthenticated = !!session;

	return (
		<header className="fixed top-0 border-b backdrop-blur-md w-full z-50 bg-white/80">
			<nav className="container mx-auto py-4 px-6 md:px-12 flex items-center justify-between">
				<Link href="/">
					<h1 className="text-2xl font-bold gradient-title">ExpenseHero</h1>
				</Link>

				<div className="flex items-center space-x-2 md:space-x-4">
					{isAuthenticated ? (
						<>
							<Link href="/dashboard">
								<Button
									variant="outline"
									className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
								>
									<LayoutDashboard size={18} />
									<span className="hidden md:inline">Dashboard</span>
								</Button>
							</Link>

							<Link href="/transaction/create">
								<Button className="flex items-center gap-2">
									<PenBox size={18} />
									<span className="hidden md:inline">Add Transaction</span>
								</Button>
							</Link>

							<LogoutBtn />
						</>
					) : (
						<>
							<Link href="/sign-in">
								<Button
									variant="ghost"
									className="cursor-pointer hover:rounded-full p-5 md:p-6"
								>
									Login
								</Button>
							</Link>

							<Link href="/sign-up">
								<Button className="hover:brightness-110 transition duration-200 shadow-md hover:shadow-lg rounded-full p-5 md:p-6 cursor-pointer bg-linear-to-r from-indigo-600 to-emerald-500">
									Sign up
								</Button>
							</Link>
						</>
					)}
				</div>
			</nav>
		</header>
	);
};

export default AppHeader;
