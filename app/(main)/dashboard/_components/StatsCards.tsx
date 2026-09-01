"use client";

import {
	ArrowDownRight,
	ArrowUpRight,
	PiggyBank,
	TrendingDown,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Account {
	id: string;
	name: string;
	balance: number | string;
	isDefault?: boolean;
}

interface Transaction {
	id: string;
	type: "INCOME" | "EXPENSE";
	amount: number;
	date: string | Date;
	category: string;
}

interface StatsCardsProps {
	accounts: Account[];
	transactions: Transaction[];
}

function useAnimatedCounter(targetValue: number, duration = 1000) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (targetValue === 0) {
			setCount(0);
			return;
		}

		let startTime: number;
		let animationFrame: number;

		const animate = (currentTime: number) => {
			if (!startTime) startTime = currentTime;
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			const easeOut = 1 - (1 - progress) ** 3;
			setCount(Math.floor(targetValue * easeOut));

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			} else {
				setCount(targetValue);
			}
		};

		animationFrame = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(animationFrame);
	}, [targetValue, duration]);

	return count;
}

export function StatsCards({ accounts, transactions }: StatsCardsProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const totalBalance = accounts.reduce((sum, acc) => {
		return sum + parseFloat(String(acc.balance));
	}, 0);

	// Calculate date-based values only when mounted
	const {
		currentMonthIncome,
		currentMonthExpenses,
		lastMonthIncome,
		lastMonthExpenses,
		categorySpending,
	} = mounted
		? (() => {
				const now = new Date();
				const currentMonth = now.getMonth();
				const currentYear = now.getFullYear();
				const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
				const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

				const currentMonthTransactions = transactions.filter((t) => {
					const date = t.date instanceof Date ? t.date : new Date(t.date);
					return (
						date.getMonth() === currentMonth && date.getFullYear() === currentYear
					);
				});

				const lastMonthTransactions = transactions.filter((t) => {
					const date = t.date instanceof Date ? t.date : new Date(t.date);
					return (
						date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
					);
				});

				const currMonthIncome = currentMonthTransactions
					.filter((t) => t.type === "INCOME")
					.reduce((sum, t) => sum + t.amount, 0);

				const currMonthExpenses = currentMonthTransactions
					.filter((t) => t.type === "EXPENSE")
					.reduce((sum, t) => sum + t.amount, 0);

				const lastMonthInc = lastMonthTransactions
					.filter((t) => t.type === "INCOME")
					.reduce((sum, t) => sum + t.amount, 0);

				const lastMonthExp = lastMonthTransactions
					.filter((t) => t.type === "EXPENSE")
					.reduce((sum, t) => sum + t.amount, 0);

				const categorySpend = currentMonthTransactions
					.filter((t) => t.type === "EXPENSE")
					.reduce<Record<string, number>>((acc, t) => {
						acc[t.category] = (acc[t.category] || 0) + t.amount;
						return acc;
					}, {});

				return {
					currentMonthIncome: currMonthIncome,
					currentMonthExpenses: currMonthExpenses,
					lastMonthIncome: lastMonthInc,
					lastMonthExpenses: lastMonthExp,
					categorySpending: categorySpend,
				};
			})()
		: {
				currentMonthIncome: 0,
				currentMonthExpenses: 0,
				lastMonthIncome: 0,
				lastMonthExpenses: 0,
				categorySpending: {},
			};

	const animatedBalance = useAnimatedCounter(mounted ? Math.floor(totalBalance) : 0);
	const animatedIncome = useAnimatedCounter(mounted ? Math.floor(currentMonthIncome) : 0);
	const animatedExpenses = useAnimatedCounter(mounted ? Math.floor(currentMonthExpenses) : 0);

	const incomeTrend =
		lastMonthIncome > 0
			? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
			: currentMonthIncome > 0
				? 100
				: 0;

	const expenseTrend =
		lastMonthExpenses > 0
			? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
			: currentMonthExpenses > 0
				? 100
				: 0;

	const netSavings = currentMonthIncome - currentMonthExpenses;
	const savingsRate =
		currentMonthIncome > 0 ? (netSavings / currentMonthIncome) * 100 : 0;

	const topCategory = Object.entries(categorySpending).sort(
		([, a], [, b]) => b - a,
	)[0];

	if (!mounted) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="stat-card">
						<div className="h-10 w-10 bg-muted rounded-lg animate-pulse mb-4" />
						<div className="h-8 bg-muted rounded animate-pulse mb-2" />
						<div className="h-4 bg-muted rounded animate-pulse" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<div className="stat-card">
				<div className="flex items-center justify-between mb-4">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Wallet className="h-6 w-6 text-primary" />
					</div>
					<span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
						{accounts.length} Account{accounts.length !== 1 ? "s" : ""}
					</span>
				</div>
				<p className="stat-label mb-1">Total Balance</p>
				<p className="stat-value">
					${animatedBalance.toLocaleString()}
					<span className="text-base font-bold text-muted-foreground">
						.{String(totalBalance.toFixed(2)).split(".")[1] || "00"}
					</span>
				</p>
			</div>

			<div className="stat-card">
				<div className="flex items-center justify-between mb-4">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
						<TrendingUp className="h-6 w-6 text-emerald-500" />
					</div>
					{incomeTrend !== 0 && (
						<span
							className={`stat-trend ${incomeTrend >= 0 ? "positive" : "negative"}`}
						>
							{incomeTrend >= 0 ? (
								<ArrowUpRight className="h-3 w-3" />
							) : (
								<ArrowDownRight className="h-3 w-3" />
							)}
							{Math.abs(incomeTrend).toFixed(0)}%
						</span>
					)}
				</div>
				<p className="stat-label mb-1">Income This Month</p>
				<p className="stat-value text-emerald-500">
					+${animatedIncome.toLocaleString()}
				</p>
			</div>

			<div className="stat-card">
				<div className="flex items-center justify-between mb-4">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
						<TrendingDown className="h-6 w-6 text-red-500" />
					</div>
					{expenseTrend !== 0 && (
						<span
							className={`stat-trend ${expenseTrend <= 0 ? "positive" : "negative"}`}
						>
							{expenseTrend <= 0 ? (
								<ArrowDownRight className="h-3 w-3" />
							) : (
								<ArrowUpRight className="h-3 w-3" />
							)}
							{Math.abs(expenseTrend).toFixed(0)}%
						</span>
					)}
				</div>
				<p className="stat-label mb-1">Expenses This Month</p>
				<p className="stat-value text-red-500">
					-${animatedExpenses.toLocaleString()}
				</p>
			</div>

			<div className="stat-card">
				<div className="flex items-center justify-between mb-4">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
						<PiggyBank className="h-6 w-6 text-indigo-500" />
					</div>
					{savingsRate !== 0 && (
						<span
							className={`stat-trend ${savingsRate >= 0 ? "positive" : "negative"}`}
						>
							{savingsRate >= 0 ? "Saved" : "Overspent"}
						</span>
					)}
				</div>
				<p className="stat-label mb-1">Savings Rate</p>
				<p
					className={`stat-value ${savingsRate >= 0 ? "text-indigo-500" : "text-red-500"}`}
				>
					{savingsRate >= 0 ? "+" : ""}
					{savingsRate.toFixed(1)}%
				</p>
				{topCategory && (
					<p className="text-xs text-muted-foreground mt-2">
						Top spend: <span className="font-bold">{topCategory[0]}</span>
					</p>
				)}
			</div>
		</div>
	);
}
