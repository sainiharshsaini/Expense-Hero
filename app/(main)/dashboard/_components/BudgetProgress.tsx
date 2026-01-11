"use client";

import { AlertTriangle, Check, Pencil, Target, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateBudget } from "@/actions/budget";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import useFetch from "@/hooks/useFetch";

type Budget = {
	amount: number;
};

type BudgetProgressProps = {
	initialBudget: Budget | null;
	currentExpenses: number;
};

const BudgetProgress = ({
	initialBudget,
	currentExpenses,
}: BudgetProgressProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [newBudget, setNewBudget] = useState(
		initialBudget?.amount?.toString() || "",
	);

	const { loading, fn: updateBudgetFn, data, error } = useFetch(updateBudget);

	const percentUsed = initialBudget
		? (currentExpenses / initialBudget.amount) * 100
		: 0;

	const handleUpdateBudget = async () => {
		const amount = parseFloat(newBudget);

		if (isNaN(amount) || amount <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}

		await updateBudgetFn(amount);
	};

	const handleCancel = () => {
		setNewBudget(initialBudget?.amount?.toString() || "");
		setIsEditing(false);
	};

	useEffect(() => {
		if (
			typeof data === "object" &&
			data !== null &&
			"success" in data &&
			(data as any).success
		) {
			setIsEditing(false);
			toast.success("Budget updated successfully");
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error((error as Error).message || "Failed to update budget");
		}
	}, [error]);

	const progressColor =
		percentUsed >= 90
			? "bg-red-500"
			: percentUsed >= 75
				? "bg-amber-500"
				: "bg-emerald-500";

	return (
		<Card className="glass-panel border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700">
			<div className="absolute top-0 right-0 p-4 opacity-[0.03]">
				{percentUsed >= 100 ? (
					<AlertTriangle className="h-24 w-24 rotate-12 text-red-500" />
				) : (
					<Target className="h-24 w-24 rotate-12 text-primary" />
				)}
			</div>

			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<div className="flex-1 space-y-1">
					<CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
						Monthly Budget
						{!isEditing && initialBudget && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsEditing(true)}
								className="h-8 w-8 rounded-full hover:bg-white/10 transition-colors"
							>
								<Pencil className="h-4 w-4" />
							</Button>
						)}
					</CardTitle>

					<div className="flex items-center gap-2">
						{isEditing ? (
							<div className="flex items-center gap-3 animate-in fade-in zoom-in duration-300">
								<div className="relative group">
									<Input
										type="number"
										value={newBudget}
										onChange={(e) => setNewBudget(e.target.value)}
										className="h-10 w-36 bg-white/5 border-white/10 rounded-xl font-bold pr-8 transition-all focus:ring-primary/20"
										placeholder="0.00"
										autoFocus
										disabled={loading}
									/>
									<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">$</span>
								</div>
								<div className="flex gap-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={handleUpdateBudget}
										disabled={loading}
										className="h-10 w-10 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
									>
										<Check className="h-5 w-5" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={handleCancel}
										disabled={loading}
										className="h-10 w-10 rounded-xl bg-red-400/10 hover:bg-red-400/20 text-red-400"
									>
										<X className="h-5 w-5" />
									</Button>
								</div>
							</div>
						) : (
							<CardDescription className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								{initialBudget ? (
									<>
										<span className="text-foreground font-black">${currentExpenses.toLocaleString()}</span>
										<span>of</span>
										<span className="text-primary font-black">${initialBudget.amount.toLocaleString()}</span>
										<span>spent this month</span>
									</>
								) : (
									<Button
										variant="link"
										className="p-0 h-auto font-black text-primary uppercase text-xs tracking-widest"
										onClick={() => setIsEditing(true)}
									>
										+ Set Monthly Target
									</Button>
								)}
							</CardDescription>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-2">
				{initialBudget && (
					<div className="space-y-4">
						<div className="relative pt-1">
							<Progress
								value={percentUsed}
								className={cn(
									"h-3 rounded-full bg-white/5",
									progressColor
								)}
							/>
							<div className="absolute inset-0 h-3 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
						</div>
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2">
								<div className={cn("h-2 w-2 rounded-full animate-pulse", progressColor.replace('bg-', 'text-'))} />
								<span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
									{percentUsed >= 100 ? "Limit Reached" : "Budget Health"}
								</span>
							</div>
							<p className={cn(
								"text-sm font-black tabular-nums",
								percentUsed >= 90 ? "text-red-400" : "text-foreground"
							)}>
								{percentUsed.toFixed(1)}% used
							</p>
						</div>
					</div>
				)}
			</CardContent>
			{initialBudget && percentUsed >= 90 && (
				<div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-500">
					<div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
						<div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
							<AlertTriangle className="h-5 w-5 text-red-500" />
						</div>
						<p className="text-[10px] font-black text-red-200 uppercase tracking-wider leading-tight">
							Critical spending alert. You are nearing your monthly limit.
						</p>
					</div>
				</div>
			)}
		</Card>
	);
};

export default BudgetProgress;
