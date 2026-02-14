"use client";

import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";

interface UserAvatarDropdownProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

export function UserAvatarDropdown({ user }: UserAvatarDropdownProps) {
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/");
					router.refresh();
				},
			},
		});
	};

	const initials = user.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: user.email?.charAt(0).toUpperCase() || "U";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-3 rounded-full p-1.5 pr-4 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
				>
					<Avatar className="h-9 w-9 border-2 border-white/10">
						<AvatarImage
							src={user.image || undefined}
							alt={user.name || "User"}
						/>
						<AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">
							{initials}
						</AvatarFallback>
					</Avatar>
					<span className="text-sm font-semibold hidden sm:block max-w-[100px] truncate">
						{user.name || user.email?.split("@")[0]}
					</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-56 glass-panel border-white/10 shadow-2xl"
			>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-bold leading-none">
							{user.name || "User"}
						</p>
						<p className="text-xs leading-none text-muted-foreground truncate">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-white/10" />
				<DropdownMenuItem asChild className="cursor-pointer font-medium py-2.5">
					<Link href="/profile" className="flex items-center">
						<User className="mr-2 h-4 w-4" />
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild className="cursor-pointer font-medium py-2.5">
					<Link href="/profile#settings" className="flex items-center">
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-white/10" />
				<DropdownMenuItem
					onClick={handleLogout}
					className="cursor-pointer font-bold py-2.5 text-red-500 focus:text-red-500 focus:bg-red-500/10"
				>
					<LogOut className="mr-2 h-4 w-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
