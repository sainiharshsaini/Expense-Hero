"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import {
	LoginFormSchema,
	type LoginFormValues,
} from "@/lib/auth/auth-zod-schema";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const LoginForm = () => {
	const router = useRouter();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: LoginFormValues) => {
		await authClient.signIn.email(
			{
				email: values.email,
				password: values.password,
				callbackURL: "/dashboard",
			},
			{
				onSuccess: () => {
					toast.success("Welcome back!");
					router.push("/dashboard");
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
			},
		);
	};

	const isPending = form.formState.isSubmitting;

	const handleGoogleSignIn = async () => {
		await authClient.signIn.social(
			{
				provider: "google",
				callbackURL: "/dashboard",
			},
			{
				onSuccess: () => {
					toast.success("Signed in with Google");
					router.push("/dashboard");
				},
				onError: (ctx) => {
					toast.error(ctx.error.message || "Google sign-in failed");
				},
			},
		);
	};

	return (
		<div className="flex flex-col gap-6 text-center animate-in fade-in zoom-in duration-500">
			<Card className="glass-panel border-white/10 shadow-2xl overflow-hidden relative">
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500" />
				<CardHeader className="space-y-1 pb-2">
					<div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
						<LogIn className="h-6 w-6 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold tracking-tight">
						Welcome back
					</CardTitle>
					<CardDescription className="text-base text-muted-foreground">
						Sign in to your account to continue
					</CardDescription>
				</CardHeader>

				<CardContent className="pt-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<div className="relative">
											<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<FormControl>
												<Input
													type="email"
													placeholder="name@example.com"
													className="pl-9 h-11 bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-medium"
													{...field}
												/>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<div className="relative">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
											>
												<title>Password Icon</title>
												<rect
													width="18"
													height="11"
													x="3"
													y="11"
													rx="2"
													ry="2"
												/>
												<path d="M7 11V7a5 5 0 0 1 10 0v4" />
											</svg>
											<FormControl>
												<Input
													type="password"
													placeholder="Your password"
													className="pl-9 h-11 bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-medium"
													{...field}
												/>
											</FormControl>
										</div>
										<div className="flex justify-end pt-1">
											<Link
												href="/forgot-password"
												className="text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
											>
												Forgot password?
											</Link>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full h-11 font-semibold text-base shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-300"
								disabled={isPending}
							>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Signing in...
									</>
								) : (
									"Sign In"
								)}
							</Button>

							<div className="relative my-6">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t border-border" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground font-medium">
										OR CONTINUE WITH
									</span>
								</div>
							</div>

							<Button
								variant="outline"
								className="w-full h-11 bg-white/5 border-white/10 hover:bg-white/10 transition-all relative overflow-hidden group"
								type="button"
								disabled={isPending}
								onClick={handleGoogleSignIn}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="mr-2 h-4 w-4"
								>
									<title>Google Icon</title>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
								</svg>
								Google
								<span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
							</Button>

							<div className="text-center text-sm text-muted-foreground mt-4">
								Don&apos;t have an account?{" "}
								<Link
									href="/sign-up"
									className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
								>
									Sign up
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginForm;
