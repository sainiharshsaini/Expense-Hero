import { Plus } from "lucide-react";
import { getCurrentBudget } from "@/actions/budget";
import type {
	SerializedAccount,
	SerializedTransaction,
} from "@/actions/dashboard";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import CreateAccountDrawer from "@/components/custom/create-account-drawer";
import { QuickAddButton } from "@/components/custom/quick-add-button";
import { Card, CardContent } from "@/components/ui/card";
import { authRequired } from "@/lib/auth/auth-utils";
import AccountCard from "./_components/AccountCard";
import BudgetProgress from "./_components/BudgetProgress";
import { DashboardOverview } from "./_components/DashboardOverview";
import { StatsCards } from "./_components/StatsCards";

type Account = SerializedAccount;
type Transaction = SerializedTransaction;

interface BudgetData {
	budget: { id: string; userId: string; amount: number } | null;
	currentExpenses: number;
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const session = await authRequired();

	const accountsRaw = await getUserAccounts();
	const accounts: Account[] = accountsRaw ?? [];

	const defaultAccount = accounts.find((a) => a.isDefault);

	let budgetData: BudgetData | null = null;
	if (defaultAccount?.id) {
		budgetData = await getCurrentBudget(defaultAccount.id);
	}

	const transactionsRaw = await getDashboardData();
	const transactions: Transaction[] = transactionsRaw ?? [];

	// Get current hour for greeting
	const hour = new Date().getHours();
	const greeting =
		hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
	const userName = session?.user?.name?.split(" ")[0] || "there";

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						{greeting}, {userName}
					</h1>
					<p className="text-muted-foreground font-medium">
						Here's an overview of your financial health.
					</p>
				</div>
			</div>

			<StatsCards accounts={accounts} transactions={transactions} />

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					{defaultAccount && (
						<BudgetProgress
							initialBudget={budgetData?.budget ?? null}
							currentExpenses={budgetData?.currentExpenses ?? 0}
						/>
					)}
					<DashboardOverview accounts={accounts} transactions={transactions} />
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold tracking-tight">Your Accounts</h2>
						<span className="text-sm font-medium text-muted-foreground">
							{accounts.length} total
						</span>
					</div>

					<div className="grid gap-4">
						<CreateAccountDrawer>
							<Card className="cursor-pointer border-dashed border-2 border-border transition-colors hover:border-primary/50 hover:bg-muted/50 group">
								<CardContent className="flex flex-col items-center justify-center p-6 text-muted-foreground group-hover:text-primary transition-colors">
									<div className="h-10 w-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-2 transition-colors">
										<Plus className="h-5 w-5" />
									</div>
									<p className="text-sm font-bold">Add New Account</p>
								</CardContent>
							</Card>
						</CreateAccountDrawer>

						{accounts.map((account) => (
							<AccountCard key={account.id} account={account} />
						))}
					</div>
				</div>
			</div>

			<QuickAddButton />
		</div>
	);
}
