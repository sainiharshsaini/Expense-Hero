import Link from "next/link";

const AppFooter = () => {
	return (
		<footer className="py-12 relative overflow-hidden">
			{/* Decorative background equivalent to hero but subtle */}
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background" />

			<div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
				<div className="flex flex-col items-center md:items-start gap-2">
					<div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-emerald-500">
						Expense Hero
					</div>
					<p className="text-sm text-muted-foreground">
						Smart financial tracking for the modern era.
					</p>
				</div>

				<div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-muted-foreground">
					<div className="text-xs">
						© {new Date().getFullYear()} ExpenseHero. Built with ❤️ by{" "}
						<Link
							href="https://harshsaini.vercel.app/"
							target="_blank"
							className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
						>
							Harsh Saini
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default AppFooter;
