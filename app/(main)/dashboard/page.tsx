import { getUserAccounts } from "@/actions/dashboard"
import CreateAccountDrawer from "@/components/CreateAccountDrawer"
import {
    Card,
    CardContent
} from "@/components/ui/card"
import { Plus } from "lucide-react"
import AccountCard from "./_components/AccountCard"
import { getCurrentBudget } from "@/actions/budget"
import BudgetProgress from "./_components/BudgetProgress"

const DashboardPage = async () => {
    const accounts = await getUserAccounts();

    const defaultAccount = accounts?.find((account) => account.isDefault);

    let budgetData: { budget: { id: string; userId: string; amount: number } | null; currentExpenses: number } | null = null

    if (defaultAccount) {
        budgetData = await getCurrentBudget(defaultAccount.id)
    }

    return (
        <div className="space-y-8">
            {/* Budget Progress */}
            {defaultAccount && (<BudgetProgress
                initialBudget={budgetData?.budget || null}
                currentExpenses={budgetData?.currentExpenses || 0}
            />)}

            {/* Dashboard Overview */}
            {/* <DashboardOverview
                accounts={accounts}
                transactions={transactions || []}
            /> */}

            {/* Accounts Grid */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CreateAccountDrawer>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
                        <CardContent className="flex flex-col items-center justify-center h-full pt-5 text-muted-foreground">
                            <Plus className="h-10 w-10 mb-2" />
                            <p className="text-sm font-medium">Add New Account</p>
                        </CardContent>
                    </Card>
                </CreateAccountDrawer>
                {accounts.length > 0 && accounts?.map((account) => {
                    return <AccountCard key={account.id} account={account} />
                })}
            </div>
        </div>
    )
}

export default DashboardPage