"use client";

import {
	BarChart3,
	LayoutDashboard,
	Menu,
	PenBox,
	UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LogoutBtn from "../auth/logout-btn";
import { Button } from "../ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../ui/drawer";

interface MobileNavProps {
	isAuthenticated: boolean;
}

export function MobileNav({ isAuthenticated }: MobileNavProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="md:hidden">
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="h-6 w-6" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader>
							<DrawerTitle className="text-center font-bold text-xl">
								Menu
							</DrawerTitle>
						</DrawerHeader>
						<div className="p-4 flex flex-col space-y-4">
							{isAuthenticated ? (
								<>
									<Link
										href="/dashboard"
										onClick={() => setOpen(false)}
										className="w-full"
									>
										<Button
											variant="secondary"
											className="w-full justify-start text-lg h-12"
										>
											<LayoutDashboard className="mr-3 h-5 w-5" />
											Dashboard
										</Button>
									</Link>

									<Link
										href="/analytics"
										onClick={() => setOpen(false)}
										className="w-full"
									>
										<Button
											variant="secondary"
											className="w-full justify-start text-lg h-12"
										>
											<BarChart3 className="mr-3 h-5 w-5" />
											Analytics
										</Button>
									</Link>

									<Link
										href="/transaction/create"
										onClick={() => setOpen(false)}
										className="w-full"
									>
										<Button className="w-full justify-start text-lg h-12">
											<PenBox className="mr-3 h-5 w-5" />
											Add Transaction
										</Button>
									</Link>

									<div className="pt-4 mt-4 border-t border-border">
										<LogoutBtn />
									</div>
								</>
							) : (
								<>
									<Link
										href="/sign-in"
										onClick={() => setOpen(false)}
										className="w-full"
									>
										<Button
											variant="ghost"
											className="w-full justify-start text-lg h-12"
										>
											<UserCircle className="mr-3 h-5 w-5" />
											Login
										</Button>
									</Link>

									<Link
										href="/sign-up"
										onClick={() => setOpen(false)}
										className="w-full"
									>
										<Button className="w-full justify-start text-lg h-12 bg-linear-to-r from-indigo-600 to-emerald-500">
											Sign up
										</Button>
									</Link>
								</>
							)}
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
