"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { categoryColors } from "@/data/categories";
import { format } from "date-fns";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface TransactionTableProps {
    transactions: Transaction[]
}

const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
} as const;

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
    const filteredAndSortedTransactions = transactions;
    const handleSort = (field: string) => {
        // Sorting logic (not implemented in your JSX)
        console.log("Sorting by", field);
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox />
                            </TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => handleSort("date")}
                            >
                                <div className="flex items-center">Date</div>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => handleSort("category")}
                            >
                                <div className="flex items-center">Category</div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => handleSort("amount")}
                            >
                                <div className="flex items-center justify-end">Amount</div>
                            </TableHead>
                            <TableHead>Recurring</TableHead>
                            <TableHead className="w-[50px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center text-muted-foreground"
                                >
                                    No Transactions Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(transaction.date), "pp")}
                                    </TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell className="capitalize">
                                        <span
                                            style={{
                                                background: categoryColors[transaction.category],
                                            }}
                                            className="px-2 py-1 rounded text-white text-sm"
                                        >
                                            {transaction.category}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        className="text-right font-medium"
                                        style={{
                                            color:
                                                transaction.type === "EXPENSE" ? "red" : "green",
                                        }}
                                    >
                                        {transaction.type === "EXPENSE" ? "-" : "+"}${transaction.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.isRecurring && transaction.recurringInterval ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Badge
                                                            variant="secondary"
                                                            className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                        >
                                                            <RefreshCw className="h-3 w-3" />
                                                            {RECURRING_INTERVALS[transaction.recurringInterval]}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="text-sm">
                                                            <div className="font-medium">Next Date:</div>
                                                            <div>
                                                                {transaction.nextRecurringDate
                                                                    ? format(
                                                                        new Date(transaction.nextRecurringDate),
                                                                        "PPP"
                                                                    )
                                                                    : "N/A"}
                                                            </div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <Badge variant="outline" className="gap-1">
                                                <Clock className="h-3 w-3" />
                                                One-time
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Billing</DropdownMenuItem>
                                                <DropdownMenuItem>Team</DropdownMenuItem>
                                                <DropdownMenuItem>Subscription</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default TransactionTable