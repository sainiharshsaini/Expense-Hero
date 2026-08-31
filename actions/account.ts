"use server";

import { revalidatePath } from "next/cache";
import { authRequired } from "@/lib/auth/auth-utils";
import prisma from "@/lib/prisma";

interface SerializableAmount {
	balance?: { toNumber: () => number };
	amount?: { toNumber: () => number };
}

const serializeTransaction = (
	obj: SerializableAmount & Record<string, unknown>,
) => {
	const serialized = { ...obj } as Record<string, unknown>;

	if (obj.balance && typeof obj.balance.toNumber === "function")
		serialized.balance = obj.balance.toNumber();
	if (obj.amount && typeof obj.amount.toNumber === "function")
		serialized.amount = obj.amount.toNumber();

	return serialized;
};

export async function updateDefaultAccount(accountId: string) {
	try {
		const session = await authRequired();
		const userId = session.user.id;

		await prisma.financialAccount.updateMany({
			where: { userId, isDefault: true },
			data: { isDefault: false },
		});

		const account = await prisma.financialAccount.update({
			where: { id: accountId, userId },
			data: { isDefault: true },
		});

		revalidatePath("/dashboard");
		return { success: true, data: serializeTransaction(account) };
	} catch (error: unknown) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export type AccountTransaction = {
	id: string;
	date: Date | string;
	amount: number;
	type: "INCOME" | "EXPENSE";
	description?: string | null;
	category: string;
};

export type AccountWithTransactionsResult = {
	id: string;
	name: string;
	type: string;
	balance: number;
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
	_count: { transactions: number };
	transactions: AccountTransaction[];
};

export async function getAccountWithTransactions(
	accountId: string,
): Promise<AccountWithTransactionsResult | null> {
	const session = await authRequired();
	const userId = session.user.id;

	const account = await prisma.financialAccount.findUnique({
		where: { id: accountId, userId },
		include: {
			transactions: {
				orderBy: { date: "desc" },
			},
			_count: {
				select: { transactions: true },
			},
		},
	});

	if (!account) return null;

	return {
		...serializeTransaction(account),
		transactions: account.transactions.map(serializeTransaction),
	} as AccountWithTransactionsResult;
}

export async function bulkDeleteTransactions(
	transactionIds: string[],
): Promise<{ success: boolean; error?: string }> {
	try {
		const session = await authRequired();
		const userId = session.user.id;

		const transactions = await prisma.transaction.findMany({
			where: {
				id: { in: transactionIds },
				userId,
			},
		});

		const accountBalanceChanges: Record<string, number> = transactions.reduce(
			(acc, transaction) => {
				const amount = transaction.amount as unknown as
					| number
					| { toNumber: () => number };
				const amountNumber =
					typeof amount === "number"
						? amount
						: amount && typeof amount.toNumber === "function"
							? amount.toNumber()
							: Number(amount as unknown);
				const change =
					transaction.type === "EXPENSE" ? amountNumber : -amountNumber;
				acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
				return acc;
			},
			{} as Record<string, number>,
		);

		await prisma.$transaction(async (tx) => {
			await tx.transaction.deleteMany({
				where: {
					id: { in: transactionIds },
					userId,
				},
			});

			for (const [accountId, balanceChange] of Object.entries(
				accountBalanceChanges,
			)) {
				await tx.financialAccount.update({
					where: { id: accountId },
					data: {
						balance: {
							increment: balanceChange,
						},
					},
				});
			}
		});

		revalidatePath("/dashboard");
		revalidatePath("/account/[id]");

		return { success: true };
	} catch (error) {
		return { success: false, error: (error as Error).message };
	}
}
