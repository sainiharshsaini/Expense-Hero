"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth/auth-client";
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

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: ForgotPasswordValues) => {
        try {
            await (authClient as any).forgetPassword({
                email: values.email,
                redirectTo: "/reset-password",
            });
            setIsSubmitted(true);
            toast.success("Password reset link sent!");
        } catch {
            // For security, show success even if email doesn't exist
            setIsSubmitted(true);
            toast.success("If an account exists, a reset link has been sent.");
        }
    };

    const isPending = form.formState.isSubmitting;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">

            <div className="fixed inset-0 -z-10 bg-background">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Card className="glass-panel border-white/10 shadow-2xl overflow-hidden relative">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />

                    <CardHeader className="text-center pt-10 pb-6 space-y-2">
                        <CardTitle className="text-3xl font-bold tracking-tight">
                            {isSubmitted ? "Check your email" : "Forgot password?"}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            {isSubmitted
                                ? "We've sent a password reset link to your email"
                                : "No worries, we'll send you reset instructions"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 pb-10">
                        {isSubmitted ? (
                            <div className="space-y-6 text-center">
                                <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <Mail className="h-8 w-8 text-emerald-500" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Didn&apos;t receive the email?{" "}
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="font-bold text-primary hover:underline"
                                    >
                                        Click to resend
                                    </button>
                                </p>
                                <Link href="/sign-in">
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 rounded-xl font-bold border-white/10 hover:bg-white/5"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to sign in
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                                    Email Address
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            type="email"
                                                            placeholder="you@example.com"
                                                            className="h-12 rounded-xl bg-white/[0.03] border-white/10 pl-11 font-medium focus-visible:ring-primary/20"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-xs font-semibold" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            "Send reset link"
                                        )}
                                    </Button>

                                    <Link href="/sign-in" className="block">
                                        <Button
                                            variant="ghost"
                                            className="w-full h-12 rounded-xl font-bold hover:bg-white/5"
                                            type="button"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back to sign in
                                        </Button>
                                    </Link>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
