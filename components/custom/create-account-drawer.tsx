"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wallet } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { createAccount } from "@/actions/dashboard";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { accountSchema } from "@/lib/zodSchema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

interface CreateAccountDrawerProps {
	children: ReactNode;
}

const CreateAccountDrawer: React.FC<CreateAccountDrawerProps> = ({
	children,
}) => {
	const [open, setOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<z.input<typeof accountSchema>>({
		resolver: zodResolver(accountSchema),
		defaultValues: {
			name: "",
			type: "CURRENT",
			balance: "",
			isDefault: false,
		},
	});

	const {
		data: newAccount,
		error,
		fn: createAccountFn,
		loading: createAccountLoading,
	} = useFetch(createAccount);

	useEffect(() => {
		if (newAccount && !createAccountLoading) {
			toast.success("Account created successfully");
			reset();
			setOpen(false);
		}
	}, [createAccountLoading, newAccount, reset]);

	useEffect(() => {
		if (error) {
			toast.error((error as Error).message || "Failed to create account");
		}
	}, [error]);

	const onSubmit = async (data: z.input<typeof accountSchema>) => {
		await createAccountFn(data);
	};

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="glass-panel border-t-white/10 max-h-[90vh]">
				<div className="mx-auto w-full max-w-lg">
					<DrawerHeader className="text-center pt-8 pb-6">
						<div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
							<Wallet className="h-7 w-7 text-primary" />
						</div>
						<DrawerTitle className="text-2xl font-bold tracking-tight">
							Create New Account
						</DrawerTitle>
						<DrawerDescription className="text-muted-foreground">
							Add a new account to track your income and expenses.
						</DrawerDescription>
					</DrawerHeader>
					<div className="px-6 pb-8">
						<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
							<div className="space-y-2">
								<label
									htmlFor="name"
									className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
								>
									Account Name
								</label>
								<Input
									{...register("name")}
									id="name"
									placeholder="e.g., Main Checking"
									className="h-12 rounded-xl bg-white/[0.03] border-white/10 px-4 font-medium focus-visible:ring-primary/20"
								/>
								{errors.name && (
									<p className="text-xs font-semibold text-red-500">
										{errors.name.message}
									</p>
								)}
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<label
										htmlFor="type"
										className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
									>
										Account Type
									</label>
									<Select
										onValueChange={(value) =>
											setValue("type", value as "CURRENT" | "SAVINGS")
										}
										defaultValue={watch("type")}
									>
										<SelectTrigger
											id="type"
											className="h-12 rounded-xl bg-white/[0.03] border-white/10 font-medium focus:ring-primary/20"
										>
											<SelectValue placeholder="Select Type" />
										</SelectTrigger>
										<SelectContent className="glass-panel border-white/10">
											<SelectItem value="CURRENT" className="font-medium">
												Current
											</SelectItem>
											<SelectItem value="SAVINGS" className="font-medium">
												Savings
											</SelectItem>
										</SelectContent>
									</Select>
									{errors.type && (
										<p className="text-xs font-semibold text-red-500">
											{errors.type.message}
										</p>
									)}
								</div>

								<div className="space-y-2">
									<label
										htmlFor="balance"
										className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
									>
										Initial Balance
									</label>
									<div className="relative">
										<div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
											$
										</div>
										<Input
											{...register("balance")}
											id="balance"
											type="number"
											step="0.01"
											placeholder="0.00"
											className="h-12 rounded-xl bg-white/[0.03] border-white/10 pl-8 font-medium focus-visible:ring-primary/20"
										/>
									</div>
									{errors.balance && (
										<p className="text-xs font-semibold text-red-500">
											{errors.balance.message}
										</p>
									)}
								</div>
							</div>

							<div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4">
								<div className="space-y-0.5">
									<label
										htmlFor="isDefault"
										className="text-sm font-bold cursor-pointer"
									>
										Set as Default
									</label>
									<p className="text-xs text-muted-foreground">
										Use this account for new transactions
									</p>
								</div>
								<Switch
									id="isDefault"
									onCheckedChange={(checked) => setValue("isDefault", checked)}
									checked={watch("isDefault")}
									className="scale-110"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4 pt-4">
								<DrawerClose asChild>
									<Button
										type="button"
										variant="ghost"
										className="h-12 rounded-xl font-bold hover:bg-white/5"
									>
										Cancel
									</Button>
								</DrawerClose>
								<Button
									type="submit"
									className="h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
									disabled={createAccountLoading}
								>
									{createAccountLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Creating...
										</>
									) : (
										"Create Account"
									)}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default CreateAccountDrawer;
