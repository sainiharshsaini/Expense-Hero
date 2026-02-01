"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Lock, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

const resetPasswordSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [isSuccess, setIsSuccess] = useState(false);

	const form = useForm<ResetPasswordValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: ResetPasswordValues) => {
		if (!token) {
			toast.error("Invalid or expired reset token");
			return;
		}

		try {
			await (authClient as any).resetPassword({
				newPassword: values.password,
				token: token,
			});
			setIsSuccess(true);
			toast.success("Password reset successfully!");
			setTimeout(() => router.push("/sign-in"), 2000);
		} catch (error: any) {
			toast.error(error.message || "Failed to reset password");
		}
	};

	const password = form.watch("password");
	const isPending = form.formState.isSubmitting;

	const strengthStats = {
		length: password.length >= 8,
		number: /\d/.test(password),
		special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		uppercase: /[A-Z]/.test(password),
	};

	return (
		<Card className="glass-panel border-white/10 shadow-2xl overflow-hidden relative">
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-violet-500 to-indigo-500" />

			<CardHeader className="text-center pt-10 pb-6">
				<CardTitle className="text-3xl font-black tracking-tight text-gradient">
					Secure Reset
				</CardTitle>
				<CardDescription className="text-muted-foreground font-medium">
					Choose a strong password for your account
				</CardDescription>
			</CardHeader>

			<CardContent className="px-8 pb-10">
				{isSuccess ? (
					<div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in zoom-in duration-500">
						<div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
							<Check className="h-10 w-10 text-emerald-400" />
						</div>
						<h3 className="text-xl font-bold">Success!</h3>
						<p className="text-center text-muted-foreground">
							Your password has been updated. Redirecting to sign in...
						</p>
					</div>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
											New Password
										</FormLabel>
										<FormControl>
											<div className="relative group">
												<Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
												<Input
													type="password"
													placeholder="••••••••"
													className="h-14 rounded-2xl bg-white/[0.03] border-white/10 pl-12 font-bold focus-visible:ring-primary/20 transition-all"
													{...field}
												/>
											</div>
										</FormControl>
										<div className="grid grid-cols-2 gap-2 pt-1">
											{Object.entries(strengthStats).map(([key, valid]) => (
												<div key={key} className="flex items-center gap-1.5">
													<div
														className={cn(
															"h-1 w-1 rounded-full",
															valid
																? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
																: "bg-white/10",
														)}
													/>
													<span
														className={cn(
															"text-[9px] font-black uppercase tracking-wider",
															valid
																? "text-emerald-400/80"
																: "text-muted-foreground/40",
														)}
													>
														{key}
													</span>
												</div>
											))}
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
											Confirm Password
										</FormLabel>
										<FormControl>
											<div className="relative group">
												<Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
												<Input
													type="password"
													placeholder="••••••••"
													className="h-14 rounded-2xl bg-white/[0.03] border-white/10 pl-12 font-bold focus-visible:ring-primary/20 transition-all"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage className="text-[10px] font-black uppercase" />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="w-full h-14 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 group overflow-hidden relative"
								disabled={isPending}
							>
								<div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
								<span className="relative flex items-center justify-center gap-2">
									{isPending ? (
										<>
											<Loader2 className="h-5 w-5 animate-spin" />
											UPDATING...
										</>
									) : (
										"SECURE ACCOUNT"
									)}
								</span>
							</Button>
						</form>
					</Form>
				)}
			</CardContent>
		</Card>
	);
}

export default function ResetPasswordPage() {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-12">
			<div className="fixed inset-0 -z-10 bg-background">
				<div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
			</div>

			<div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
				<Suspense
					fallback={
						<Card className="glass-panel border-white/10 shadow-2xl overflow-hidden relative p-8 flex items-center justify-center">
							<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-violet-500 to-indigo-500" />
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</Card>
					}
				>
					<ResetPasswordForm />
				</Suspense>
			</div>
		</div>
	);
}
