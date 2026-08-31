"use client";

import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
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

interface Account {
	id: string;
	name: string;
	balance: number | string;
}

interface Transaction {
	id: string;
	type: "INCOME" | "EXPENSE";
	amount: number;
	date: string | Date;
	category: string;
}

interface AnalyticsChartsProps {
	accounts: Account[];
	transactions: Transaction[];
}

const COLORS = [
	"#6366f1",
	"#8b5cf6",
	"#a855f7",
	"#d946ef",
	"#ec4899",
	"#f43f5e",
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#14b8a6",
	"#06b6d4",
];

export function AnalyticsCharts({
	accounts: _accounts,
	transactions,
}: AnalyticsChartsProps) {
	const [timeRange, setTimeRange] = useState<"3" | "6" | "12">("6");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const monthsToShow = parseInt(timeRange, 10);

	const monthlyData = useMemo(() => {
		const now = new Date();
		const months = Array.from({ length: monthsToShow }, (_, i) => {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			return {
				month: date.getMonth(),
				year: date.getFullYear(),
				label: format(date, "MMM"),
				fullLabel: format(date, "MMM yyyy"),
			};
		}).reverse();

		return months.map(({ month, year, label, fullLabel }) => {
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

			return {
				name: label,
				fullName: fullLabel,
				income,
				expenses,
				net: income - expenses,
			};
		});
	}, [transactions, monthsToShow]);

	const categoryData = useMemo(() => {
		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		const monthTransactions = transactions.filter((t) => {
			const date = t.date instanceof Date ? t.date : new Date(t.date);
			return (
				t.type === "EXPENSE" &&
				date.getMonth() === currentMonth &&
				date.getFullYear() === currentYear
			);
		});

		const categoryTotals = monthTransactions.reduce<Record<string, number>>(
			(acc, t) => {
				acc[t.category] = (acc[t.category] || 0) + t.amount;
				return acc;
			},
			{},
		);

		return Object.entries(categoryTotals)
			.map(([name, value], index) => ({
				name,
				value,
				color: COLORS[index % COLORS.length],
			}))
			.sort((a, b) => b.value - a.value);
	}, [transactions]);

	const topCategories = useMemo(() => {
		return categoryData.slice(0, 5);
	}, [categoryData]);

	interface TooltipPayloadEntry {
		name: string;
		value: number;
		color?: string;
		payload?: { fullName?: string };
	}
	const CustomTooltip = ({
		active,
		payload,
		label,
	}: {
		active?: boolean;
		payload?: TooltipPayloadEntry[];
		label?: string;
	}) => {
		if (active && payload && payload.length) {
			return (
				<div className="rounded-lg border border-border bg-popover p-3 shadow-md">
					<p className="text-xs font-bold text-muted-foreground mb-2">
						{payload[0]?.payload?.fullName ?? label}
					</p>
					{payload.map((entry) => (
						<p
							key={entry.name}
							className="text-sm font-bold"
							style={{ color: entry.color }}
						>
							{entry.name}: ${entry.value.toLocaleString()}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			{/* Income vs Expenses Trend */}
			<Card className="lg:col-span-2">
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-xl font-bold tracking-tight">
						Income vs Expenses Trend
					</CardTitle>
					<Select
						value={timeRange}
						onValueChange={(v) => setTimeRange(v as "3" | "6" | "12")}
					>
						<SelectTrigger className="h-9 w-[140px] border-border bg-background">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="border-border bg-popover">
							<SelectItem value="3">Last 3 months</SelectItem>
							<SelectItem value="6">Last 6 months</SelectItem>
							<SelectItem value="12">Last 12 months</SelectItem>
						</SelectContent>
					</Select>
				</CardHeader>
				<CardContent>
					<div className="h-[350px] w-full">
						{!mounted ? (
							<div className="flex items-center justify-center h-full">
								<div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
							</div>
						) : (
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={monthlyData}
									margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
								>
									<defs>
										<linearGradient
											id="incomeGradient"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
											<stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
										</linearGradient>
										<linearGradient
											id="expenseGradient"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
											<stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="rgba(255,255,255,0.1)"
									/>
									<XAxis
										dataKey="name"
										stroke="rgba(255,255,255,0.5)"
										fontSize={12}
										tickLine={false}
										axisLine={false}
									/>
									<YAxis
										stroke="rgba(255,255,255,0.5)"
										fontSize={12}
										tickLine={false}
										axisLine={false}
										tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Legend />
									<Area
										type="monotone"
										dataKey="income"
										name="Income"
										stroke="#22c55e"
										strokeWidth={2}
										fill="url(#incomeGradient)"
									/>
									<Area
										type="monotone"
										dataKey="expenses"
										name="Expenses"
										stroke="#ef4444"
										strokeWidth={2}
										fill="url(#expenseGradient)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Spending by Category */}
			<Card className="glass-panel border-white/10 shadow-xl">
				<CardHeader>
					<CardTitle className="text-xl font-bold tracking-tight">
						Spending by Category
					</CardTitle>
					<p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
						Current Month
					</p>
				</CardHeader>
				<CardContent>
					{categoryData.length === 0 ? (
						<div className="h-[300px] flex items-center justify-center text-muted-foreground">
							No expenses this month
						</div>
					) : (
						<div className="h-[300px] w-full">
							{!mounted ? (
								<div className="flex items-center justify-center h-full">
									<div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
								</div>
							) : (
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={categoryData}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={100}
											paddingAngle={3}
											dataKey="value"
										>
											{categoryData.map((entry, index) => (
												<Cell
													// biome-ignore lint/suspicious/noArrayIndexKey: Recharts cells need unique keys, and index is stable here
													key={`cell-${index}`}
													fill={entry.color}
													stroke="none"
												/>
											))}
										</Pie>
										<Tooltip
											formatter={(value) =>
												typeof value === "number"
													? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
													: "$0.00"
											}
											contentStyle={{
												backgroundColor: "rgba(0, 0, 0, 0.8)",
												border: "1px solid rgba(255, 255, 255, 0.1)",
												borderRadius: "12px",
												backdropFilter: "blur(10px)",
											}}
											itemStyle={{ color: "#fff", fontWeight: "bold" }}
										/>
										<Legend
											verticalAlign="bottom"
											height={36}
											iconType="circle"
											formatter={(value) => (
												<span className="text-xs font-bold text-muted-foreground ml-1">
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

			{/* Top Spending Categories */}
			<Card className="glass-panel border-white/10 shadow-xl">
				<CardHeader>
					<CardTitle className="text-xl font-bold tracking-tight">
						Top Spending Categories
					</CardTitle>
					<p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
						Current Month
					</p>
				</CardHeader>
				<CardContent>
					{topCategories.length === 0 ? (
						<div className="h-[300px] flex items-center justify-center text-muted-foreground">
							No expenses this month
						</div>
					) : (
						<div className="h-[300px] w-full">
							{!mounted ? (
								<div className="flex items-center justify-center h-full">
									<div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
								</div>
							) : (
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={topCategories}
										layout="vertical"
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="rgba(255,255,255,0.1)"
											horizontal={false}
										/>
										<XAxis
											type="number"
											stroke="rgba(255,255,255,0.5)"
											fontSize={12}
											tickLine={false}
											axisLine={false}
											tickFormatter={(value) => `$${value.toLocaleString()}`}
										/>
										<YAxis
											type="category"
											dataKey="name"
											stroke="rgba(255,255,255,0.5)"
											fontSize={12}
											tickLine={false}
											axisLine={false}
											width={80}
										/>
										<Tooltip
											formatter={(value) =>
												typeof value === "number"
													? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
													: "$0.00"
											}
											contentStyle={{
												backgroundColor: "rgba(0, 0, 0, 0.8)",
												border: "1px solid rgba(255, 255, 255, 0.1)",
												borderRadius: "12px",
												backdropFilter: "blur(10px)",
											}}
											itemStyle={{ color: "#fff", fontWeight: "bold" }}
										/>
										<Bar dataKey="value" radius={[0, 8, 8, 0]}>
											{topCategories.map((entry, index) => (
												// biome-ignore lint/suspicious/noArrayIndexKey: Recharts cells need unique keys, and index is stable here
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
