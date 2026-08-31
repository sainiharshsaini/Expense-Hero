"use client";

import {
	ArrowUpRight,
	CheckCircle2,
	ChevronRight,
	PiggyBank,
	ShieldCheck,
	Sparkles,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const HeroSection = () => {
	return (
		<section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden pt-36 md:pt-32 pb-20">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-500/20 via-background to-background" />
			<div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

			<div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center gap-10">
				<div className="max-w-4xl text-center z-10 space-y-8">
					<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-muted-foreground backdrop-blur-xl">
						Smart money control
					</div>
					<h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-[-0.06em] leading-[0.94] text-balance">
						Spend smarter.
						<span className="gradient-title">Grow faster.</span>
					</h1>

					<p className="mx-auto max-w-2xl text-base md:text-xl text-muted-foreground">
						AI-powered budgeting, expense tracking, and financial clarity for
						people who want more control over every dollar.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link href="/dashboard" className="w-full sm:w-auto">
							<Button
								size="lg"
								className="w-full sm:w-auto h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/25"
							>
								Get Started
								<ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>

				<div className="mt-6 grid w-full max-w-5xl gap-4 md:grid-cols-3 z-10">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(79,70,229,0.12)]">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
							<TrendingUp className="h-5 w-5" />
						</div>
						<p className="text-xs font-black uppercase tracking-[0.24em] text-muted-foreground">
							Savings
						</p>
						<p className="mt-3 text-3xl font-black tracking-tight">+$2,450</p>
						<p className="mt-2 text-sm text-muted-foreground">This month</p>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(16,185,129,0.10)]">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
							<PiggyBank className="h-5 w-5" />
						</div>
						<p className="text-xs font-black uppercase tracking-[0.24em] text-muted-foreground">
							Budget
						</p>
						<p className="mt-3 text-3xl font-black tracking-tight">82%</p>
						<p className="mt-2 text-sm text-muted-foreground">On target</p>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(99,102,241,0.12)]">
						<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
							<ArrowUpRight className="h-5 w-5" />
						</div>
						<p className="text-xs font-black uppercase tracking-[0.24em] text-muted-foreground">
							Growth
						</p>
						<p className="mt-3 text-3xl font-black tracking-tight">+18.4%</p>
						<p className="mt-2 text-sm text-muted-foreground">Quarterly</p>
					</div>
				</div>

				<div className="mt-12 grid w-full max-w-5xl gap-4 md:grid-cols-3 z-10">
					<div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl">
						<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
							<CheckCircle2 className="h-5 w-5" />
						</div>
						<p className="text-sm font-bold text-foreground">Instant clarity</p>
						<p className="mt-2 text-sm text-muted-foreground">
							See your spending, trends, and budget health without digging
							through spreadsheets.
						</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl">
						<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
							<Sparkles className="h-5 w-5" />
						</div>
						<p className="text-sm font-bold text-foreground">
							AI-assisted insights
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							Get smarter recommendations that help you spend intentionally and
							save more.
						</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl">
						<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
							<ShieldCheck className="h-5 w-5" />
						</div>
						<p className="text-sm font-bold text-foreground">
							Built for confidence
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							Keep your finances organized, protected, and ready for the next
							big move.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
