import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div className="space-y-2">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-5 w-80" />
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Skeletons don't need stable identities
					<div key={i} className="stat-card">
						<div className="flex items-center justify-between mb-4">
							<Skeleton className="h-12 w-12 rounded-2xl" />
							<Skeleton className="h-5 w-16 rounded-full" />
						</div>
						<Skeleton className="h-4 w-24 mb-2" />
						<Skeleton className="h-8 w-32" />
					</div>
				))}
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<div className="lg:col-span-2 glass-panel border-white/10 rounded-3xl p-6">
					<div className="flex justify-between mb-4">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-9 w-32" />
					</div>
					<Skeleton className="h-[350px] w-full rounded-xl" />
				</div>

				<div className="glass-panel border-white/10 rounded-3xl p-6">
					<Skeleton className="h-6 w-40 mb-2" />
					<Skeleton className="h-4 w-24 mb-4" />
					<Skeleton className="h-[300px] w-full rounded-xl" />
				</div>

				<div className="glass-panel border-white/10 rounded-3xl p-6">
					<Skeleton className="h-6 w-48 mb-2" />
					<Skeleton className="h-4 w-24 mb-4" />
					<Skeleton className="h-[300px] w-full rounded-xl" />
				</div>
			</div>
		</div>
	);
}
