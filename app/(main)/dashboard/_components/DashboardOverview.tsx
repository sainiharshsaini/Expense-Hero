"use client";

import { format } from "date-fns";
import {
  History,
  PieChart as PieChartIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Account = {
  id: string;
  name: string;
  isDefault?: boolean;
};

type Transaction = {
  id: string;
  accountId: string;
  amount: number;
  type: "EXPENSE" | "INCOME";
  category: string;
  description?: string;
  date: string | Date;
};

type Props = {
  accounts: Account[];
  transactions: Transaction[];
};

const COLORS = [
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f59e0b", // Amber
  "#10b981", // Emerald
];

export function DashboardOverview({
  accounts,
  transactions,
}: Props) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id,
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId,
  );

  const recentTransactions = mounted
    ? [...accountTransactions]
        .sort((a, b) => {
          const dateA =
            a.date instanceof Date ? a.date : new Date(a.date);

          const dateB =
            b.date instanceof Date ? b.date : new Date(b.date);

          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5)
    : [];

  const currentMonthExpenses = mounted
    ? accountTransactions.filter((t) => {
        const now = new Date();

        const d =
          t.date instanceof Date ? t.date : new Date(t.date);

        return (
          t.type === "EXPENSE" &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
    : [];

  const expensesByCategory = currentMonthExpenses.reduce<
    Record<string, number>
  >((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    }),
  );

  const totalSpending = Object.values(expensesByCategory).reduce(
    (total, amount) => total + amount,
    0,
  );

  if (!mounted) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* =========================
          Recent Activity
      ========================== */}
      <Card className="overflow-hidden border-0 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-lg bg-purple-50 p-2">
                <History className="h-4 w-4 text-purple-600" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  Recent Activity
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  Latest transactions
                </p>
              </div>
            </div>

            <Select
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
            >
              <SelectTrigger className="h-8 w-[130px] shrink-0 border-gray-200 bg-white text-sm">
                <SelectValue placeholder="Account" />
              </SelectTrigger>

              <SelectContent className="border-gray-200 bg-white">
                {accounts.map((account) => (
                  <SelectItem
                    key={account.id}
                    value={account.id}
                    className="text-sm"
                  >
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transactions */}
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                <History className="h-5 w-5 text-gray-400" />
              </div>

              <p className="text-sm font-medium text-gray-500">
                No transactions yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                >
                  {/* Left side */}
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-semibold",
                        t.type === "EXPENSE"
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600",
                      )}
                    >
                      {t.type === "EXPENSE" ? "−" : "+"}
                    </div>

                    {/* Transaction details */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {t.description || "Cash Transfer"}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {t.category}
                      </p>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="shrink-0 text-right">
                    <p
                      className={cn(
                        "whitespace-nowrap text-sm font-semibold tabular-nums",
                        t.type === "EXPENSE"
                          ? "text-red-600"
                          : "text-emerald-600",
                      )}
                    >
                      {t.type === "EXPENSE" ? "−" : "+"}$
                      {t.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>

                    <p className="mt-0.5 whitespace-nowrap text-xs text-gray-500">
                      {format(
                        t.date instanceof Date
                          ? t.date
                          : new Date(t.date),
                        "MMM dd",
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* =========================
          Expense Distribution
      ========================== */}
      <Card className="overflow-hidden border-0 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-2">
              <PieChartIcon className="h-4 w-4 text-orange-600" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Expense Distribution
              </h3>

              <p className="mt-0.5 text-xs text-gray-500">
                Current month breakdown
              </p>
            </div>
          </div>

          {/* Empty state */}
          {pieChartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                <PieChartIcon className="h-5 w-5 text-gray-400" />
              </div>

              <p className="text-sm font-medium text-gray-500">
                No expenses recorded
              </p>
            </div>
          ) : (
            <>
              {/* Chart */}
              <div className="relative mb-4 h-64">
                {/* Center text */}
                <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
                  <span className="mb-1 text-xs font-medium text-gray-500">
                    Total Spending
                  </span>

                  <span className="text-2xl font-bold tabular-nums text-gray-900">
                    $
                    {totalSpending.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      content={({ active, payload }) => {
                        if (
                          !active ||
                          !payload ||
                          payload.length === 0
                        ) {
                          return null;
                        }

                        const value =
                          typeof payload[0].value === "number"
                            ? payload[0].value
                            : 0;

                        const percentage =
                          totalSpending > 0
                            ? (value / totalSpending) * 100
                            : 0;

                        return (
                          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md">
                            <p className="mb-1 text-xs font-medium text-gray-600">
                              {payload[0].name}
                            </p>

                            <p className="text-sm font-bold tabular-nums text-gray-900">
                              $
                              {value.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {percentage.toFixed(1)}% of total
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                {pieChartData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[index % COLORS.length],
                        }}
                      />

                      <span className="truncate font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>

                    <span className="shrink-0 font-semibold tabular-nums text-gray-600">
                      $
                      {item.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}