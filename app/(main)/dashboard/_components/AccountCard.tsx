"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { updateDefaultAccount } from "@/actions/account";

interface Account {
    id: string;
    name: string;
    type: "CURRENT" | "SAVINGS";
    balance: number | string;
    isDefault: boolean;
}


interface AccountCardProps {
    account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
    const { name, type, balance, id, isDefault } = account;
    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error,
    } = useFetch(updateDefaultAccount);

    // 3. Proper event typing
    const handleDefaultChange = async (event: any) => {
        event.preventDefault();

        if (isDefault) {
            toast.warning("You need at least 1 default account");
            return;
        }

        await updateDefaultFn(id);
    };

    useEffect(() => {
        if (updatedAccount?.success) {
            toast.success("Default account updated successfully");
        }
    }, [updatedAccount]);

    useEffect(() => {
        if (error) {
            const err = error as Error
            toast.error(err.message || "Failed to update default account");
        }
    }, [error]);


    return (
        <Card className="hover:shadow-md transition-shadow group relative">
            <Link href={`/account/${id}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                        {name}
                    </CardTitle>
                    <Switch
                        checked={isDefault}
                        onClick={handleDefaultChange}
                        disabled={updateDefaultLoading}
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${parseFloat(balance).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {type.charAt(0) + type.slice(1).toLowerCase()} Account
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                        Income
                    </div>
                    <div className="flex items-center">
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                        Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>
    )
}

export default AccountCard