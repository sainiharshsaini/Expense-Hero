import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-8">

            <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-80" />
            </div>


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 slide-up-stagger">
                {[...Array(4)].map((_, i) => (
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


            <div className="grid gap-8 lg:grid-cols-3">

                <div className="lg:col-span-2 space-y-8">

                    <div className="glass-panel border-white/10 rounded-2xl p-8">
                        <div className="flex justify-between mb-6">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                            <div className="text-right space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-7 w-28" />
                            </div>
                        </div>
                        <Skeleton className="h-3 w-full rounded-full" />
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-1">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-6 w-12" />
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="glass-panel border-white/10 rounded-2xl p-6">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-panel border-white/10 rounded-2xl p-6">
                            <Skeleton className="h-6 w-28 mb-2" />
                            <Skeleton className="h-4 w-36 mb-4" />
                            <Skeleton className="h-[280px] w-full rounded-xl" />
                        </div>
                    </div>
                </div>


                <div className="space-y-6">
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-5 w-12" />
                    </div>
                    <div className="grid gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="glass-panel border-white/10 rounded-2xl p-6">
                                <div className="flex justify-between mb-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-24" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <Skeleton className="h-5 w-10 rounded-full" />
                                </div>
                                <Skeleton className="h-8 w-32 mb-4" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
