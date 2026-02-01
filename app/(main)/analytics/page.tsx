import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import { authRequired } from "@/lib/auth/auth-utils";
import { AnalyticsCharts } from "./_components/analytics-charts";
import { SpendingSummary } from "./_components/spending-summary";

export const metadata = {
	title: "Analytics | Expense Hero",
	description: "Visualize and analyze your spending patterns",
};

export default async function AnalyticsPage() {
	await authRequired();

	const [accounts, transactions] = await Promise.all([
		getUserAccounts(),
		getDashboardData(),
	]);

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div className="space-y-1">
				<h1 className="text-3xl md:text-4xl font-black tracking-tight">
					Analytics
				</h1>
				<p className="text-muted-foreground font-medium">
					Visualize and understand your spending patterns.
				</p>
			</div>

			<SpendingSummary transactions={transactions ?? []} />

			<AnalyticsCharts
				accounts={accounts ?? []}
				transactions={transactions ?? []}
			/>
		</div>
	);
}
