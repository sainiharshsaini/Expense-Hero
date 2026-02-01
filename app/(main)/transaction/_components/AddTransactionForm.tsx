"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { SerializedAccount } from "@/actions/dashboard";
import {
	createTransaction,
	type SerializedTransactionForForm,
	updateTransaction,
} from "@/actions/transaction";
import CreateAccountDrawer from "@/components/custom/create-account-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import { transactionSchema } from "@/lib/zodSchema";
import { ReceiptScanner } from "./ReceiptScanner";

type Account = SerializedAccount;

interface Category {
	id: string;
	name: string;
}

interface TransactionData {
	type: "EXPENSE" | "INCOME";
	amount: number;
	description: string;
	accountId: string;
	category: string;
	date: string | Date;
	isRecurring: boolean;
	recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
}

export function AddTransactionForm({
	accounts,
	categories,
	editMode = false,
	initialData = null,
}: {
	accounts: Account[];
	categories: Category[];
	editMode?: boolean;
	initialData?: TransactionData | SerializedTransactionForForm | null;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const editId = searchParams.get("edit");

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		getValues,
		reset,
	} = useForm({
		resolver: zodResolver(transactionSchema),
		defaultValues:
			editMode && initialData
				? {
						type: initialData.type as "EXPENSE" | "INCOME",
						amount: initialData.amount.toString(),
						description: initialData.description ?? "",
						accountId: initialData.accountId,
						category: initialData.category,
						date: new Date(initialData.date),
						isRecurring: initialData.isRecurring,
						...(initialData.recurringInterval && {
							recurringInterval: initialData.recurringInterval as
								| "DAILY"
								| "WEEKLY"
								| "MONTHLY"
								| "YEARLY",
						}),
					}
				: {
						type: "EXPENSE" as const,
						amount: "",
						description: "",
						accountId: accounts.find((ac: any) => ac.isDefault)?.id || "",
						date: new Date(),
						isRecurring: false,
					},
	});

	const {
		loading: transactionLoading,
		fn: transactionFn,
		data: transactionResult,
	} = useFetch(editMode ? updateTransaction : createTransaction);

	const onSubmit = (data: any) => {
		const formData = {
			...data,
			amount: parseFloat(data.amount),
		};

		if (editMode) {
			transactionFn(editId, formData);
		} else {
			transactionFn(formData);
		}
	};

	const handleScanComplete = (scannedData: any) => {
		if (scannedData) {
			setValue("amount", scannedData.amount.toString());
			setValue("date", new Date(scannedData.date));
			if (scannedData.description) {
				setValue("description", scannedData.description);
			}
			if (scannedData.category) {
				setValue("category", scannedData.category);
			}
			toast.success("Receipt scanned successfully");
		}
	};

	useEffect(() => {
		if (
			transactionResult &&
			typeof transactionResult === "object" &&
			"success" in transactionResult &&
			transactionResult.success &&
			!transactionLoading
		) {
			toast.success(
				editMode
					? "Transaction updated successfully"
					: "Transaction created successfully",
			);
			reset();
			router.push(`/account/${(transactionResult as any).data.accountId}`);
		}
	}, [transactionResult, transactionLoading, editMode, reset, router]);

	const type = watch("type");
	const isRecurring = watch("isRecurring");
	const date = watch("date");

	const filteredCategories = categories.filter(
		(category: any) => category.type === type,
	);

	return (
		<div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-8 glass-panel border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
			>
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

				{!editMode && (
					<div className="bg-white/5 rounded-2xl p-4 border border-white/10 overflow-hidden relative group transition-all duration-300 hover:bg-white/10">
						<ReceiptScanner onScanComplete={handleScanComplete} />
					</div>
				)}

				<div className="grid gap-8 md:grid-cols-2">
					<div className="space-y-4">
						<label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
							Transaction Type
						</label>
						<Select
							onValueChange={(value: any) => setValue("type", value)}
							defaultValue={type}
						>
							<SelectTrigger className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all text-lg font-medium">
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent className="glass-panel border-white/10">
								<SelectItem
									value="EXPENSE"
									className="text-red-400 font-bold focus:bg-red-400/10"
								>
									Expense
								</SelectItem>
								<SelectItem
									value="INCOME"
									className="text-emerald-400 font-bold focus:bg-emerald-400/10"
								>
									Income
								</SelectItem>
							</SelectContent>
						</Select>
						{errors.type && (
							<p className="text-sm text-red-500 animate-in shake duration-300">
								{errors.type.message}
							</p>
						)}
					</div>

					<div className="space-y-4">
						<label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
							Amount
						</label>
						<div className="relative group">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground group-focus-within:text-primary transition-colors">
								$
							</span>
							<Input
								type="number"
								step="0.01"
								placeholder="0.00"
								className="pl-10 h-12 bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all text-xl font-bold tracking-tight"
								{...register("amount")}
							/>
						</div>
						{errors.amount && (
							<p className="text-sm text-red-500 animate-in shake duration-300">
								{errors.amount.message}
							</p>
						)}
					</div>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					<div className="space-y-4">
						<label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
							Account
						</label>
						<Select
							onValueChange={(value) => setValue("accountId", value)}
							defaultValue={getValues("accountId")}
						>
							<SelectTrigger className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-medium">
								<SelectValue placeholder="Select account" />
							</SelectTrigger>
							<SelectContent className="glass-panel border-white/10">
								{accounts.map((account: any) => (
									<SelectItem
										key={account.id}
										value={account.id}
										className="font-medium"
									>
										{account.name}{" "}
										<span className="text-muted-foreground ml-2">
											(${parseFloat(account.balance).toFixed(2)})
										</span>
									</SelectItem>
								))}
								<CreateAccountDrawer>
									<Button
										variant="ghost"
										className="relative flex w-full cursor-default select-none items-center rounded-lg py-3 pl-8 pr-2 text-sm outline-none hover:bg-primary/20 hover:text-primary-foreground font-semibold"
									>
										+ Create New Account
									</Button>
								</CreateAccountDrawer>
							</SelectContent>
						</Select>
						{errors.accountId && (
							<p className="text-sm text-red-500 animate-in shake duration-300">
								{errors.accountId.message}
							</p>
						)}
					</div>

					<div className="space-y-4">
						<label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
							Category
						</label>
						<Select
							onValueChange={(value) => setValue("category", value)}
							defaultValue={getValues("category")}
						>
							<SelectTrigger className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-medium">
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent className="glass-panel border-white/10 max-h-[300px]">
								{filteredCategories.map((category: any) => (
									<SelectItem
										key={category.id}
										value={category.id}
										className="font-medium"
									>
										{category.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.category && (
							<p className="text-sm text-red-500 animate-in shake duration-300">
								{errors.category.message}
							</p>
						)}
					</div>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					<div className="space-y-4">
						<label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
							Date
						</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full h-12 pl-4 text-left font-medium bg-white/5 border-white/10 hover:bg-white/10 transition-all",
										!date && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-3 h-5 w-5 text-primary" />
									{date ? format(date, "PPP") : <span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-auto p-0 glass-panel border-white/10"
								align="start"
							>
								<Calendar
									mode="single"
									selected={date}
									onSelect={(date: any) => setValue("date", date)}
									disabled={(date) =>
										date > new Date() || date < new Date("1900-01-01")
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						{errors.date && (
							<p className="text-sm text-red-500 animate-in shake duration-300">
								{errors.date.message}
							</p>
						)}
					</div>

					<div className="space-y-4">
						<label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
							Description
						</label>
						<Input
							placeholder="Enter description"
							className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-medium"
							{...register("description")}
						/>
						{errors.description && (
							<p className="text-sm text-red-500 animate-in shake duration-300">
								{errors.description.message}
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-row items-center justify-between rounded-2xl border border-white/10 px-6 py-5 bg-white/5 hover:bg-white/10 transition-colors group">
					<div className="space-y-1">
						<label className="text-lg font-bold tracking-tight">
							Recurring Transaction
						</label>
						<div className="text-sm text-muted-foreground font-medium">
							Set up a recurring schedule for this transaction
						</div>
					</div>
					<Switch
						checked={isRecurring}
						onCheckedChange={(checked) => setValue("isRecurring", checked)}
						className="data-[state=checked]:bg-primary"
					/>
				</div>

				{isRecurring && (
					<div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
						<label className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
							Recurring Interval
						</label>
						<Select
							onValueChange={(value: any) =>
								setValue("recurringInterval", value)
							}
							defaultValue={getValues("recurringInterval")}
						>
							<SelectTrigger className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary/20 transition-all font-medium">
								<SelectValue placeholder="Select interval" />
							</SelectTrigger>
							<SelectContent className="glass-panel border-white/10">
								<SelectItem value="DAILY" className="font-medium">
									Daily
								</SelectItem>
								<SelectItem value="WEEKLY" className="font-medium">
									Weekly
								</SelectItem>
								<SelectItem value="MONTHLY" className="font-medium">
									Monthly
								</SelectItem>
								<SelectItem value="YEARLY" className="font-medium">
									Yearly
								</SelectItem>
							</SelectContent>
						</Select>
						{errors.recurringInterval && (
							<p className="text-sm text-red-500 animate-in shake duration-300">
								{errors.recurringInterval.message}
							</p>
						)}
					</div>
				)}

				<div className="flex gap-4 pt-6">
					<Button
						type="button"
						variant="outline"
						className="flex-1 h-14 text-lg font-bold bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-2xl"
						onClick={() => router.back()}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						className="flex-1 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all duration-300 rounded-2xl"
						disabled={transactionLoading}
					>
						{transactionLoading ? (
							<>
								<Loader2 className="mr-2 h-6 w-6 animate-spin" />
								{editMode ? "Updating..." : "Creating..."}
							</>
						) : editMode ? (
							"Update Transaction"
						) : (
							"Create Transaction"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
