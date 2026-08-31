"use client";

import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
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

type Transaction = {
	id: string;
	date: string | Date;
	amount: number;
	type: "INCOME" | "EXPENSE";
	description?: string | null;
};

type ChartData = {
	date: string;
	income: number;
	expense: number;
};

type AccountChartProps = {
	transactions: Transaction[];
};

const DATE_RANGES: { [key: string]: { label: string; days: number | null } } = {
	"7D": { label: "Last 7 Days", days: 7 },
	"1M": { label: "Last Month", days: 30 },
	"3M": { label: "Last 3 Months", days: 90 },
	"6M": { label: "Last 6 Months", days: 180 },
	ALL: { label: "All Time", days: null },
};

const AccountChart = ({ transactions }: AccountChartProps) => {
	const [dataRange, setDataRange] = useState<string>("1M");

	const filteredData: ChartData[] = useMemo(() => {
		const range = DATE_RANGES[dataRange as keyof typeof DATE_RANGES];
		const now = new Date();
		const startDate = range.days
			? startOfDay(subDays(now, range.days))
			: startOfDay(new Date(0));

		const filtered = transactions.filter(
			(t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now),
		);

		const grouped = filtered.reduce<Record<string, ChartData>>(
			(acc, transaction) => {
				const date = format(new Date(transaction.date), "MMM dd");
				if (!acc[date]) {
					acc[date] = { date, income: 0, expense: 0 };
				}
				if (transaction.type === "INCOME") {
					acc[date].income += transaction.amount;
				} else {
					acc[date].expense += transaction.amount;
				}

				return acc;
			},
			{},
		);

		return Object.values(grouped).sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);
	}, [transactions, dataRange]);

	const totals = useMemo(() => {
		return filteredData.reduce(
			(acc, day) => ({
				income: acc.income + day.income,
				expense: acc.expense + day.expense,
			}),
			{ income: 0, expense: 0 },
		);
	}, [filteredData]);

	return (
		<Card className="glass-panel border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 bg-white/5 border-b border-white/10">
				<div>
					<CardTitle className="text-xl font-black tracking-tight text-foreground">
						Financial Overview
					</CardTitle>
					<p className="text-sm text-muted-foreground font-medium mt-1">
						Real-time spending analysis
					</p>
				</div>
				<Select value={dataRange} onValueChange={(v) => setDataRange(v)}>
					<SelectTrigger className="w-[160px] h-11 bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-bold">
						<SelectValue placeholder="Select range" />
					</SelectTrigger>
					<SelectContent className="glass-panel border-white/10">
						{Object.entries(DATE_RANGES).map(([key, { label }]) => (
							<SelectItem key={key} value={key} className="font-bold">
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="pt-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<div className="text-center p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors group">
						<p className="text-xs font-black uppercase tracking-widest text-emerald-500/60 mb-2">
							Total Income
						</p>
						<p className="text-3xl font-black text-emerald-400 tabular-nums">
							$
							{totals.income.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
						<div className="mt-2 h-1 w-12 bg-emerald-400 mx-auto rounded-full opacity-40 group-hover:w-20 transition-all duration-500" />
					</div>
					<div className="text-center p-6 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors group">
						<p className="text-xs font-black uppercase tracking-widest text-red-500/60 mb-2">
							Total Expenses
						</p>
						<p className="text-3xl font-black text-red-400 tabular-nums">
							$
							{totals.expense.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
						<div className="mt-2 h-1 w-12 bg-red-400 mx-auto rounded-full opacity-40 group-hover:w-20 transition-all duration-500" />
					</div>
					<div className="text-center p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-colors group">
						<p className="text-xs font-black uppercase tracking-widest text-indigo-500/60 mb-2">
							Net Cash Flow
						</p>
						<p
							className={cn(
								"text-3xl font-black tabular-nums",
								totals.income - totals.expense >= 0
									? "text-primary"
									: "text-amber-400",
							)}
						>
							$
							{(totals.income - totals.expense).toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
						<div
							className={cn(
								"mt-2 h-1 w-12 mx-auto rounded-full opacity-40 group-hover:w-20 transition-all duration-500",
								totals.income - totals.expense >= 0
									? "bg-primary"
									: "bg-amber-400",
							)}
						/>
					</div>
				</div>
				<div className="h-[350px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={filteredData}
							margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
							barGap={8}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke="rgba(255,255,255,0.05)"
							/>
							<XAxis
								dataKey="date"
								fontSize={12}
								fontWeight={700}
								tickLine={false}
								axisLine={false}
								tick={{ fill: "rgba(255,255,255,0.4)" }}
							/>
							<YAxis
								fontSize={12}
								fontWeight={700}
								tickLine={false}
								axisLine={false}
								tick={{ fill: "rgba(255,255,255,0.4)" }}
								tickFormatter={(value) => `$${value}`}
							/>
							<Tooltip
								cursor={{ fill: "rgba(255,255,255,0.03)" }}
								content={({ active, payload }) => {
									if (active && payload && payload.length) {
										return (
											<div className="glass-panel border-white/10 p-4 shadow-2xl min-w-[150px]">
												<p className="text-xs font-black uppercase text-muted-foreground mb-2">
													{payload[0].payload.date}
												</p>
												{payload.map(
													(p: {
														dataKey: string;
														payload?: { date?: string };
														fill?: string;
														name?: string;
														value?: number;
													}) => (
														<div
															key={p.dataKey}
															className="flex justify-between items-center gap-4 py-1"
														>
															<span className="flex items-center gap-2">
																<div
																	className="w-2 h-2 rounded-full"
																	style={{ background: p.fill }}
																/>
																<span className="text-xs font-bold capitalize">
																	{p.name}:
																</span>
															</span>
															<span
																className="text-sm font-black tabular-nums"
																style={{ color: p.fill }}
															>
																${(p.value ?? 0).toLocaleString()}
															</span>
														</div>
													),
												)}
											</div>
										);
									}
									return null;
								}}
							/>
							<Legend
								verticalAlign="top"
								align="right"
								height={36}
								iconType="circle"
								formatter={(value) => (
									<span className="text-xs font-black text-muted-foreground mr-4 translate-y-[-2px] inline-block">
										{value}
									</span>
								)}
							/>
							<Bar
								dataKey="income"
								name="Income"
								fill="#10b981"
								radius={[6, 6, 0, 0]}
								maxBarSize={40}
							/>
							<Bar
								dataKey="expense"
								name="Expense"
								fill="#f43f5e"
								radius={[6, 6, 0, 0]}
								maxBarSize={40}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
};

export default AccountChart;
