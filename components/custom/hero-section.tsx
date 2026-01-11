"use client";

import { ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";

const HeroSection = () => {
	const imageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			if (scrollPosition > 50) {
				imageRef.current?.classList.add("scrolled");
			} else {
				imageRef.current?.classList.remove("scrolled");
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden pt-36 md:pt-32 pb-20">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-background to-background" />
			<div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

			<div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
				<div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-8 z-10">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary text-secondary-foreground text-sm font-medium backdrop-blur-md mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
						<span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
						New Features Available
					</div>

					<h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
						Manage Your <br className="hidden md:block" /> Expenses with{' '}
						<span className="gradient-title">Intelligence.</span>
					</h1>

					<p className="text-muted-foreground text-lg md:text-xl max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
						AI-driven personal finance platform. Track spending,
						unlock insights, and optimize your wealth in real-time.
					</p>

					<div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
						<Link href={"/dashboard"} className="w-full sm:w-auto">
							<Button
								size={"lg"}
								className="w-full sm:w-auto h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/25"
							>
								Get Started
								<ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
						<Link
							target="_blank"
							href={"https://youtu.be/rOLyWlDpb8Q?si=dt7pnRfNulim2cCG"}
							className="w-full sm:w-auto"
						>
							<Button
								size="lg"
								variant={"outline"}
								className="w-full sm:w-auto h-12 px-8 rounded-full border-2 hover:bg-secondary/50 transition-all duration-300"
							>
								<Play className="mr-2 h-4 w-4 fill-current" />
								View Demo
							</Button>
						</Link>
					</div>


				</div>

				<div className="flex-1 w-full max-w-[600px] perspective-1000 z-10 animate-in fade-in zoom-in duration-1000 delay-300">
					<div
						ref={imageRef}
						className="hero-image-wrapper relative group"
					>
						<div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

						<div className="hero-image glass-panel p-2 rounded-2xl relative overflow-hidden">
							<Image
								width={1200}
								height={800}
								src={"/hero-section-img.svg"}
								alt="Dashboard Preview"
								className="rounded-xl w-full h-auto object-cover shadow-2xl"
								priority
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>

							<div className="absolute -bottom-6 -left-6 p-4 glass-panel rounded-xl shadow-lg animate-bounce duration-[3000ms]">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Total Savings</p>
										<p className="font-bold text-lg">+$2,450.00</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
