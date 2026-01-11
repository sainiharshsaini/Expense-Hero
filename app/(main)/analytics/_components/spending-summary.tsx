"use client";

import {
    ArrowDownRight,
    ArrowUpRight,
    DollarSign,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

interface Transaction {
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    date: string | Date;
    category: string;
}

interface SpendingSummaryProps {
    transactions: Transaction[];
}

export function SpendingSummary({ transactions }: SpendingSummaryProps) {
    const now = new Date();

    const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            month: date.getMonth(),
            year: date.getFullYear(),
            label: date.toLocaleDateString("en-US", { month: "short" }),
        };
    }).reverse();

    const monthlyData = months.map(({ month, year, label }) => {
        const monthTransactions = transactions.filter((t) => {
            const date = t.date instanceof Date ? t.date : new Date(t.date);
            return date.getMonth() === month && date.getFullYear() === year;
        });

        const income = monthTransactions
            .filter((t) => t.type === "INCOME")
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthTransactions
            .filter((t) => t.type === "EXPENSE")
            .reduce((sum, t) => sum + t.amount, 0);

        return { label, income, expenses, net: income - expenses };
    });

    const currentMonth = monthlyData[monthlyData.length - 1];
    const lastMonth = monthlyData[monthlyData.length - 2];

    const incomeChange = lastMonth?.income
        ? ((currentMonth.income - lastMonth.income) / lastMonth.income) * 100
        : 0;

    const expenseChange = lastMonth?.expenses
        ? ((currentMonth.expenses - lastMonth.expenses) / lastMonth.expenses) * 100
        : 0;

    const avgMonthlySpending =
        monthlyData.reduce((sum, m) => sum + m.expenses, 0) / monthlyData.length;

    const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <div className="stat-card group">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-6 w-6 text-emerald-500" />
                    </div>
                    {incomeChange !== 0 && (
                        <span className={`stat-trend ${incomeChange >= 0 ? "positive" : "negative"}`}>
                            {incomeChange >= 0 ? (
                                <ArrowUpRight className="h-3 w-3" />
                            ) : (
                                <ArrowDownRight className="h-3 w-3" />
                            )}
                            {Math.abs(incomeChange).toFixed(0)}%
                        </span>
                    )}
                </div>
                <p className="stat-label mb-1">Total Income</p>
                <p className="stat-value text-emerald-500">
                    ${totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    This month: ${currentMonth.income.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
            </div>


            <div className="stat-card group">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingDown className="h-6 w-6 text-red-500" />
                    </div>
                    {expenseChange !== 0 && (
                        <span className={`stat-trend ${expenseChange <= 0 ? "positive" : "negative"}`}>
                            {expenseChange <= 0 ? (
                                <ArrowDownRight className="h-3 w-3" />
                            ) : (
                                <ArrowUpRight className="h-3 w-3" />
                            )}
                            {Math.abs(expenseChange).toFixed(0)}%
                        </span>
                    )}
                </div>
                <p className="stat-label mb-1">Total Expenses</p>
                <p className="stat-value text-red-500">
                    ${totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    This month: ${currentMonth.expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
            </div>


            <div className="stat-card group">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <p className="stat-label mb-1">Net Savings</p>
                <p
                    className={`stat-value ${totalIncome - totalExpenses >= 0 ? "text-emerald-500" : "text-red-500"}`}
                >
                    {totalIncome - totalExpenses >= 0 ? "+" : "-"}$
                    {Math.abs(totalIncome - totalExpenses).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Savings rate:{" "}
                    <span className="font-bold">
                        {totalIncome > 0
                            ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
                            : 0}
                        %
                    </span>
                </p>
            </div>


            <div className="stat-card group">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg
                            className="h-6 w-6 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                </div>
                <p className="stat-label mb-1">Avg Monthly Spending</p>
                <p className="stat-value text-indigo-500">
                    ${avgMonthlySpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Based on last 6 months
                </p>
            </div>
        </div>
    );
}
