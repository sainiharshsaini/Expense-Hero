"use client";

import { format } from "date-fns";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	MoreHorizontal,
	RefreshCw,
	Search,
	Trash,
	X,
	Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { bulkDeleteTransactions } from "@/actions/account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { categoryColors } from "@/data/categories";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import { BarLoader } from "react-spinners";

interface Transaction {
	id: string;
	date: string;
	description: string;
	category: string;
	amount: number;
	type: "INCOME" | "EXPENSE";
	isRecurring: boolean;
	recurringInterval?: keyof typeof RECURRING_INTERVALS;
	nextRecurringDate?: string;
}

const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
	DAILY: "Daily",
	WEEKLY: "Weekly",
	MONTHLY: "Monthly",
	YEARLY: "Yearly",
} as const;

type SortConfig = {
	field: string;
	direction: "asc" | "desc";
};

interface TransactionTableProps {
	transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({
	transactions,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [recurringFilter, setRecurringFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const router = useRouter();

	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		field: "date",
		direction: "desc",
	});

	const {
		loading: deleteLoading,
		fn: deleteFn,
		data: deleted,
	} = useFetch(bulkDeleteTransactions);

	const filteredAndSortedTransactions = useMemo(() => {
		let result = [...transactions];

		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase();
			result = result.filter((transaction) =>
				transaction.description?.toLowerCase().includes(searchLower),
			);
		}
		if (typeFilter && typeFilter !== "all") {
			result = result.filter((transaction) => transaction.type === typeFilter);
		}

		if (recurringFilter && recurringFilter !== "all") {
			result = result.filter((transaction) => {
				if (recurringFilter === "recurring") return transaction.isRecurring;
				return !transaction.isRecurring;
			});
		}

		result.sort((a, b) => {
			let comparison = 0;

			switch (sortConfig.field) {
				case "date":
					comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
					break;
				case "amount":
					comparison = a.amount - b.amount;
					break;
				case "category":
					comparison = a.category.localeCompare(b.category);
					break;
				default:
					comparison = 0;
			}

			return sortConfig.direction === "asc" ? comparison : -comparison;
		});
		return result;
	}, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

	const totalPages = Math.ceil(
		filteredAndSortedTransactions.length / ITEMS_PER_PAGE,
	);

	const paginationTransactions = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredAndSortedTransactions.slice(
			startIndex,
			startIndex + ITEMS_PER_PAGE,
		);
	}, [filteredAndSortedTransactions, currentPage]);

	const handleSort = (field: string): void => {
		setSortConfig(
			(current: SortConfig): SortConfig => ({
				field,
				direction:
					current.field === field && current.direction === "asc"
						? "desc"
						: "asc",
			}),
		);
	};

	const handleSelect = (id: string): void => {
		setSelectedIds((current: string[]): string[] =>
			current.includes(id)
				? current.filter((item) => item !== id)
				: [...current, id],
		);
	};

	const handleSelectAll = () => {
		setSelectedIds((current) =>
			current.length === paginationTransactions.length
				? []
				: paginationTransactions.map((t) => t.id),
		);
	};

	const handleBulkDelete = async () => {
		if (
			!window.confirm(
				`Are you sure you want to delete ${selectedIds.length} transactions?`,
			)
		)
			return;

		deleteFn(selectedIds);
	};

	useEffect(() => {
		if (deleted && !deleteLoading) {
			toast.success("Transactions deleted successfully");
			setSelectedIds([]);
		}
	}, [deleted, deleteLoading]);

	const handleClearFilters = () => {
		setSearchTerm("");
		setTypeFilter("");
		setRecurringFilter("");
		setSelectedIds([]);
	};

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
		setSelectedIds([]);
	};

	const exportToCSV = () => {
		const headers = ["Date", "Description", "Category", "Type", "Amount"];
		const data = filteredAndSortedTransactions.map((t) => [
			format(new Date(t.date), "yyyy-MM-dd"),
			t.description || "N/A",
			t.category,
			t.type,
			t.amount.toFixed(2),
		]);

		const csvContent = [headers, ...data].map((e) => e.join(",")).join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="space-y-6 animate-in fade-in duration-700">
			{deleteLoading && (
				<BarLoader className="mb-4" width={"100%"} color="#9333ea" />
			)}

			<div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white/[0.02] p-4 rounded-3xl border border-white/5 backdrop-blur-sm">
				<div className="relative w-full lg:w-80 group">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
					<Input
						placeholder="Search transactions..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 font-medium"
					/>
				</div>

				<div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
					<Select value={typeFilter} onValueChange={setTypeFilter}>
						<SelectTrigger className="w-full lg:w-[130px] h-12 bg-white/5 border-white/10 rounded-2xl font-bold">
							<SelectValue placeholder="All Types" />
						</SelectTrigger>
						<SelectContent className="glass-panel border-white/10">
							<SelectItem value="all" className="font-bold">All Types</SelectItem>
							<SelectItem value="INCOME" className="font-bold text-emerald-400">Income</SelectItem>
							<SelectItem value="EXPENSE" className="font-bold text-red-400">Expense</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={recurringFilter}
						onValueChange={(value) => setRecurringFilter(value)}
					>
						<SelectTrigger className="w-full lg:w-[160px] h-12 bg-white/5 border-white/10 rounded-2xl font-bold">
							<SelectValue placeholder="Schedule" />
						</SelectTrigger>
						<SelectContent className="glass-panel border-white/10">
							<SelectItem value="all" className="font-bold">All Schedules</SelectItem>
							<SelectItem value="recurring" className="font-bold text-primary">Recurring Only</SelectItem>
							<SelectItem value="non-recurring" className="font-bold text-muted-foreground">One-time Only</SelectItem>
						</SelectContent>
					</Select>

					<Button
						variant="outline"
						className="h-12 w-full lg:w-auto px-6 bg-white/5 border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all gap-2"
						onClick={exportToCSV}
					>
						<Download className="h-4 w-4" />
						Export
					</Button>

					{selectedIds.length > 0 && (
						<Button
							variant="destructive"
							size="sm"
							onClick={handleBulkDelete}
							className="h-12 px-6 shadow-xl shadow-destructive/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] animate-in zoom-in duration-300"
						>
							<Trash className="h-4 w-4 mr-2" />
							Delete ({selectedIds.length})
						</Button>
					)}

					<Button
						variant="outline"
						className="h-12 w-12 p-0 bg-white/5 border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all text-red-400 hover:text-red-500"
						onClick={handleClearFilters}
						title="Clear Filters"
					>
						<X className="h-5 w-5" />
					</Button>
				</div>
			</div>

			<div className="rounded-3xl border border-white/10 overflow-hidden glass-panel shadow-2xl">
				<Table>
					<TableHeader className="bg-white/5">
						<TableRow className="hover:bg-transparent border-white/10 h-14">
							<TableHead className="w-[50px] pl-6">
								<Checkbox
									onCheckedChange={handleSelectAll}
									checked={
										selectedIds.length === paginationTransactions.length &&
										paginationTransactions.length > 0
									}
									className="border-white/20 data-[state=checked]:bg-primary"
								/>
							</TableHead>
							<TableHead
								className="cursor-pointer group select-none"
								onClick={() => handleSort("date")}
							>
								<div className="flex items-center font-bold text-muted-foreground group-hover:text-primary transition-colors">
									Date
									{sortConfig.field === "date" && (
										sortConfig.direction === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
									)}
								</div>
							</TableHead>
							<TableHead>Description</TableHead>
							<TableHead
								className="cursor-pointer group select-none"
								onClick={() => handleSort("category")}
							>
								<div className="flex items-center font-bold text-muted-foreground group-hover:text-primary transition-colors">
									Category
									{sortConfig.field === "category" && (
										sortConfig.direction === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
									)}
								</div>
							</TableHead>
							<TableHead
								className="cursor-pointer group select-none text-right"
								onClick={() => handleSort("amount")}
							>
								<div className="flex items-center justify-end font-bold text-muted-foreground group-hover:text-primary transition-colors">
									Amount
									{sortConfig.field === "amount" && (
										sortConfig.direction === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
									)}
								</div>
							</TableHead>
							<TableHead className="text-right pr-6">Recurring</TableHead>
							<TableHead className="w-[70px] pr-6"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginationTransactions.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="h-40 text-center text-muted-foreground font-medium">
									No transactions found.
								</TableCell>
							</TableRow>
						) : (
							paginationTransactions.map((transaction) => (
								<TableRow key={transaction.id} className="border-white/5 hover:bg-white/[0.02] transition-colors h-16 group">
									<TableCell className="pl-6">
										<Checkbox
											onCheckedChange={() => handleSelect(transaction.id)}
											checked={selectedIds.includes(transaction.id)}
											className="border-white/20 data-[state=checked]:bg-primary"
										/>
									</TableCell>
									<TableCell className="text-sm font-medium text-muted-foreground tabular-nums">
										{format(new Date(transaction.date), "MMM d, yyyy")}
									</TableCell>
									<TableCell className="font-bold text-foreground max-w-[200px] truncate">
										{transaction.description}
									</TableCell>
									<TableCell>
										<span
											className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
											style={{
												backgroundColor: (categoryColors as any)[transaction.category] + "15",
												color: (categoryColors as any)[transaction.category]
											}}
										>
											{transaction.category}
										</span>
									</TableCell>
									<TableCell className={cn(
										"text-right font-black tabular-nums h-16",
										transaction.type === "INCOME" ? "text-emerald-400" : "text-red-400"
									)}>
										{transaction.type === "INCOME" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
									</TableCell>
									<TableCell className="text-right pr-6">
										{transaction.isRecurring ? (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger>
														<div className="flex items-center justify-end gap-2 text-primary group-hover:scale-110 transition-transform">
															<RefreshCw className="h-4 w-4" />
															<span className="text-[10px] font-black uppercase tracking-tight">
																{RECURRING_INTERVALS[transaction.recurringInterval!] || "Recurring"}
															</span>
														</div>
													</TooltipTrigger>
													<TooltipContent className="glass-panel border-white/10 font-bold">
														Next: {format(new Date(transaction.nextRecurringDate!), "MMM d")}
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										) : (
											<span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight opacity-30">One-time</span>
										)}
									</TableCell>
									<TableCell className="pr-6">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="glass-panel border-white/10 min-w-[160px]">
												<DropdownMenuItem
													onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}
													className="font-bold text-xs"
												>
													Edit Transaction
												</DropdownMenuItem>
												<DropdownMenuSeparator className="bg-white/5" />
												<DropdownMenuItem
													className="text-red-400 font-bold text-xs"
													onClick={() => deleteFn([transaction.id])}
												>
													Delete Transaction
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 pt-4">
					<Button
						variant="outline"
						size="icon"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="rounded-xl border-white/10 bg-white/5 disabled:opacity-30"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<div className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-white/5 border border-white/10">
						<span className="text-sm font-black text-primary">{currentPage}</span>
						<span className="text-xs font-bold text-muted-foreground">/</span>
						<span className="text-sm font-bold text-muted-foreground">{totalPages}</span>
					</div>
					<Button
						variant="outline"
						size="icon"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="rounded-xl border-white/10 bg-white/5 disabled:opacity-30"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);
};

export default TransactionTable;
