"use client";

import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	"#10b981", // Emerald
	"#3b82f6", // Blue
	"#8b5cf6", // Violet
	"#f43f5e", // Rose
	"#f59e0b", // Amber
	"#06b6d4", // Cyan
	"#ec4899", // Pink
];

export function DashboardOverview({ accounts, transactions }: Props) {
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

	const recentTransactions = [...accountTransactions]
		.sort((a, b) => {
			const dateA = a.date instanceof Date ? a.date : new Date(a.date);
			const dateB = b.date instanceof Date ? b.date : new Date(b.date);
			return dateB.getTime() - dateA.getTime();
		})
		.slice(0, 5);

	const now = new Date();
	const currentMonthExpenses = accountTransactions.filter((t) => {
		const d = t.date instanceof Date ? t.date : new Date(t.date);
		return (
			t.type === "EXPENSE" &&
			d.getMonth() === now.getMonth() &&
			d.getFullYear() === now.getFullYear()
		);
	});

	const expensesByCategory = currentMonthExpenses.reduce<
		Record<string, number>
	>((acc, t) => {
		acc[t.category] = (acc[t.category] || 0) + t.amount;
		return acc;
	}, {});

	const pieChartData = Object.entries(expensesByCategory).map(
		([category, amount]) => ({ name: category, value: amount }),
	);

	return (
		<div className="grid gap-8 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-5 duration-700">
			<Card className="glass-panel border-white/10 shadow-2xl overflow-hidden hover:shadow-primary/5 transition-all duration-500">
				<CardHeader className="flex flex-row items-center justify-between pb-6 bg-white/5 border-b border-white/10">
					<div>
						<CardTitle className="text-xl font-black tracking-tight">
							Recent Activity
						</CardTitle>
						<p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
							Latest Transactions
						</p>
					</div>
					<Select
						value={selectedAccountId}
						onValueChange={setSelectedAccountId}
					>
						<SelectTrigger className="w-[160px] h-10 bg-white/5 border-white/10 font-bold focus:ring-primary/20">
							<SelectValue placeholder="Select account" />
						</SelectTrigger>
						<SelectContent className="glass-panel border-white/10">
							{accounts.map((account) => (
								<SelectItem
									key={account.id}
									value={account.id}
									className="font-bold"
								>
									{account.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</CardHeader>
				<CardContent className="pt-6">
					{recentTransactions.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
							<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
								<ArrowUpRight className="h-8 w-8" />
							</div>
							<p className="font-black uppercase tracking-tighter text-sm">
								No transaction history found
							</p>
						</div>
					) : (
						<div className="space-y-1">
							{recentTransactions.map((t, _i) => (
								<div
									key={t.id}
									className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5"
								>
									<div className="flex items-center gap-4">
										<div
											className={cn(
												"w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-xl shadow-lg transition-transform group-hover:scale-110 duration-300",
												t.type === "EXPENSE"
													? "bg-red-500/10 text-red-500 shadow-red-500/10"
													: "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10",
											)}
										>
											{t.type === "EXPENSE" ? "-" : "+"}
										</div>
										<div className="space-y-0.5">
											<p className="text-base font-semibold tracking-tight leading-none">
												{t.description || "Cash Transfer"}
											</p>
											<p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
												{format(
													t.date instanceof Date ? t.date : new Date(t.date),
													"MMMM dd, yyyy",
												)}
											</p>
										</div>
									</div>
									<div
										className={cn(
											"flex flex-col items-end gap-1",
											t.type === "EXPENSE"
												? "text-red-400"
												: "text-emerald-400",
										)}
									>
										<span className="text-md font-semibold tabular-nums tracking-tighter">
											{t.type === "EXPENSE" ? "-" : "+"}$
											{t.amount.toLocaleString(undefined, {
												minimumFractionDigits: 2,
											})}
										</span>
										<div
											className={cn(
												"px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
												t.type === "EXPENSE"
													? "bg-red-500/5 border-red-500/20"
													: "bg-emerald-500/5 border-emerald-500/20",
											)}
										>
											{t.category}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<Card className="glass-panel border-white/10 shadow-2xl overflow-hidden hover:shadow-primary/5 transition-all duration-500">
				<CardHeader className="bg-white/5 border-b border-white/10">
					<CardTitle className="text-xl font-black tracking-tight">
						Expense Distribution
					</CardTitle>
					<p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
						Current Month Statistics
					</p>
				</CardHeader>
				<CardContent className="pt-10 pb-10">
					{pieChartData.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
							<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
								<ArrowUpRight className="h-8 w-8" />
							</div>
							<p className="font-black uppercase tracking-tighter text-sm">
								No data analysis available
							</p>
						</div>
					) : (
						<div className="h-[350px] relative">
							<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
								<span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">
									Total Spending
								</span>
								<span className="text-3xl font-black tracking-tighter">
									$
									{Object.values(expensesByCategory)
										.reduce((a, b) => a + b, 0)
										.toLocaleString(undefined, { minimumFractionDigits: 2 })}
								</span>
							</div>
							{!mounted ? (
								<div className="flex items-center justify-center h-full">
									<div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
								</div>
							) : (
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={pieChartData}
											cx="50%"
											cy="50%"
											innerRadius={100}
											outerRadius={130}
											paddingAngle={5}
											dataKey="value"
											animationBegin={0}
											animationDuration={1500}
										>
											{pieChartData.map((entry, index) => (
												<Cell
													key={entry.name}
													fill={COLORS[index % COLORS.length]}
													strokeWidth={0}
													className="hover:scale-105 transition-transform duration-300 outline-none"
												/>
											))}
										</Pie>
										<Tooltip
											content={({ active, payload }) => {
												if (active && payload && payload.length) {
													return (
														<div className="glass-panel border-white/10 p-4 shadow-2xl scale-110">
															<div className="flex items-center gap-3 mb-2">
																<div
																	className="w-3 h-3 rounded-full"
																	style={{
																		background:
																			(payload[0].payload as any).fill ||
																			COLORS[0],
																	}}
																/>
																<p className="text-xs font-black uppercase text-muted-foreground tracking-widest">
																	{payload[0].name}
																</p>
															</div>
															<p className="text-2xl font-black tabular-nums tracking-tighter">
																$
																{typeof payload[0].value === "number"
																	? payload[0].value.toLocaleString()
																	: "0.00"}
															</p>
															<p className="text-[10px] font-black text-primary uppercase mt-1">
																{(
																	((typeof payload[0].value === "number"
																		? payload[0].value
																		: 0) /
																		Object.values(expensesByCategory).reduce(
																			(a, b) => a + b,
																			0,
																		)) *
																	100
																).toFixed(1)}
																% of total
															</p>
														</div>
													);
												}
												return null;
											}}
										/>
										<Legend
											verticalAlign="bottom"
											align="center"
											iconType="circle"
											formatter={(value) => (
												<span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mx-2">
													{value}
												</span>
											)}
										/>
									</PieChart>
								</ResponsiveContainer>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
