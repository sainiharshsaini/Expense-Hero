"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Check, Key, Loader2, Mail, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/auth-client";

interface ProfileClientProps {
	user: {
		id: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
});

const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export default function ProfileClient({ user }: ProfileClientProps) {
	const router = useRouter();
	const [isUploadingPhoto, _setIsUploadingPhoto] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const profileForm = useForm({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user.name || "",
		},
	});

	const passwordForm = useForm({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const initials = user.name
		? user.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
		: user.email?.charAt(0).toUpperCase() || "U";

	const handlePhotoClick = () => {
		fileInputRef.current?.click();
	};

	const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		toast.success("Profile photo updated! (Demo mode - photo not persisted)");
	};

	const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
		try {
			await authClient.updateUser({
				name: values.name,
			});
			toast.success("Profile updated successfully!");
			router.refresh();
		} catch {
			toast.error("Failed to update profile");
		}
	};

	const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
		try {
			await authClient.changePassword({
				currentPassword: values.currentPassword,
				newPassword: values.newPassword,
			});
			toast.success("Password changed successfully!");
			passwordForm.reset();
		} catch {
			toast.error(
				"Failed to change password. Please check your current password.",
			);
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-10">
			<div className="glass-panel relative overflow-hidden rounded-[2.5rem] border-white/10 shadow-2xl p-8 md:p-12">
				<div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-32 -mt-32" />
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -ml-20 -mb-20" />

				<div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
					<div className="relative group">
						<Avatar className="h-32 w-32 border-4 border-white/10 shadow-2xl">
							<AvatarImage
								src={user.image || undefined}
								alt={user.name || "User"}
							/>
							<AvatarFallback className="bg-primary/20 text-primary font-black text-4xl">
								{initials}
							</AvatarFallback>
						</Avatar>
						<button
							type="button"
							onClick={handlePhotoClick}
							disabled={isUploadingPhoto}
							className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
						>
							{isUploadingPhoto ? (
								<Loader2 className="h-8 w-8 text-white animate-spin" />
							) : (
								<Camera className="h-8 w-8 text-white" />
							)}
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handlePhotoChange}
							className="hidden"
						/>
					</div>

					<div className="text-center md:text-left space-y-2">
						<h1 className="text-3xl md:text-4xl font-black tracking-tight">
							{user.name || "User"}
						</h1>
						<p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
							<Mail className="h-4 w-4" />
							{user.email}
						</p>
						<div className="flex items-center justify-center md:justify-start gap-2 text-sm text-emerald-500 font-bold">
							<Check className="h-4 w-4" />
							Verified Account
						</div>
					</div>
				</div>
			</div>

			<div className="grid gap-8 md:grid-cols-2" id="settings">
				<Card className="glass-panel border-white/10 shadow-xl">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
								<User className="h-5 w-5 text-primary" />
							</div>
							<div>
								<CardTitle className="text-lg font-bold">Profile</CardTitle>
								<CardDescription>
									Update your personal information
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<Form {...profileForm}>
							<form
								onSubmit={profileForm.handleSubmit(onProfileSubmit)}
								className="space-y-4"
							>
								<FormField
									control={profileForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												Display Name
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													className="h-12 rounded-xl bg-white/[0.03] border-white/10 font-medium focus-visible:ring-primary/20"
												/>
											</FormControl>
											<FormMessage className="text-xs font-semibold" />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full h-11 rounded-xl font-bold"
									disabled={profileForm.formState.isSubmitting}
								>
									{profileForm.formState.isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Saving...
										</>
									) : (
										"Save Changes"
									)}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>

				<Card className="glass-panel border-white/10 shadow-xl">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
								<Shield className="h-5 w-5 text-orange-500" />
							</div>
							<div>
								<CardTitle className="text-lg font-bold">Security</CardTitle>
								<CardDescription>Manage your password</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<Form {...passwordForm}>
							<form
								onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
								className="space-y-4"
							>
								<FormField
									control={passwordForm.control}
									name="currentPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												Current Password
											</FormLabel>
											<FormControl>
												<div className="relative">
													<Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
													<Input
														{...field}
														type="password"
														className="h-12 rounded-xl bg-white/[0.03] border-white/10 pl-11 font-medium focus-visible:ring-primary/20"
													/>
												</div>
											</FormControl>
											<FormMessage className="text-xs font-semibold" />
										</FormItem>
									)}
								/>
								<Separator className="bg-white/10" />
								<FormField
									control={passwordForm.control}
									name="newPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												New Password
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="password"
													className="h-12 rounded-xl bg-white/[0.03] border-white/10 font-medium focus-visible:ring-primary/20"
												/>
											</FormControl>
											<FormMessage className="text-xs font-semibold" />
										</FormItem>
									)}
								/>
								<FormField
									control={passwordForm.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												Confirm New Password
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="password"
													className="h-12 rounded-xl bg-white/[0.03] border-white/10 font-medium focus-visible:ring-primary/20"
												/>
											</FormControl>
											<FormMessage className="text-xs font-semibold" />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									variant="outline"
									className="w-full h-11 rounded-xl font-bold border-white/10 hover:bg-white/5"
									disabled={passwordForm.formState.isSubmitting}
								>
									{passwordForm.formState.isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Updating...
										</>
									) : (
										"Change Password"
									)}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
