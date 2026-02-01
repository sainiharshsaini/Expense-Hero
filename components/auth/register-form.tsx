"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import {
	RegisterFormSchema,
	type RegisterFormValues,
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
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const RegisterForm = () => {
	const router = useRouter();

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(RegisterFormSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: RegisterFormValues) => {
		await authClient.signUp.email(
			{
				name: values.email.split("@")[0],
				email: values.email,
				password: values.password,
				callbackURL: "/dashboard",
			},
			{
				onSuccess: () => {
					toast.success("Account created successfully!");
					router.push("/dashboard");
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
			},
		);
	};

	const isPending = form.formState.isSubmitting;

	return (
		<div className="flex flex-col gap-6 text-center animate-in fade-in zoom-in duration-500 delay-100">
			<Card className="glass-panel border-white/10 shadow-2xl overflow-hidden relative">
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-indigo-500" />
				<CardHeader className="space-y-1 pb-2">
					<div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
						<UserPlus className="h-6 w-6 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold tracking-tight">
						Create Account
					</CardTitle>
					<CardDescription className="text-base text-muted-foreground">
						Enter your details to get started
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
										<div className="relative group">
											<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
											<FormControl>
												<Input
													type="password"
													placeholder="Password"
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
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<div className="relative group">
											<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
											<FormControl>
												<Input
													type="password"
													placeholder="Confirm Password"
													className="pl-9 h-11 bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-medium"
													{...field}
												/>
											</FormControl>
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
										Creating account...
									</>
								) : (
									"Sign Up"
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
								Already have an account?{" "}
								<Link
									href="/sign-in"
									className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
								>
									Sign in
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default RegisterForm;
