"use server";

import { revalidatePath } from "next/cache";
import { authRequired } from "@/lib/auth/auth-utils";
import prisma from "@/lib/prisma";

export type SerializedAccount = {
	id: string;
	name: string;
	type: "CURRENT" | "SAVINGS";
	balance: number;
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
	_count: {
		transactions: number;
	};
};

interface AccountWithDecimalBalance extends Omit<SerializedAccount, "balance" | "_count"> {
	balance: { toNumber: () => number };
	_count?: { transactions: number };
}

const serializeTransaction = (
	obj: AccountWithDecimalBalance,
): SerializedAccount => {
	const serialized = {
		...obj,
		balance: obj.balance.toNumber(),
		_count: obj._count ?? { transactions: 0 },
	} as unknown as SerializedAccount;
	return serialized;
};

interface CreateAccountInput {
	name: string;
	type: "CURRENT" | "SAVINGS";
	balance: string;
	isDefault: boolean;
}

interface CreateAccountResponse {
	success: boolean;
	data: SerializedAccount;
}

export async function createAccount(
	data: CreateAccountInput,
): Promise<CreateAccountResponse> {
	try {
		const session = await authRequired();
		const userId = session.user.id;

		const balanceFloat = parseFloat(data.balance);
		if (Number.isNaN(balanceFloat)) throw new Error("Invalid balance amount");

		const existingAccounts = await prisma.financialAccount.findMany({
			where: { userId },
		});

		const shouldBeDefault = existingAccounts.length === 0 || data.isDefault;

		if (shouldBeDefault) {
			await prisma.financialAccount.updateMany({
				where: { userId, isDefault: true },
				data: { isDefault: false },
			});
		}

		const account = await prisma.financialAccount.create({
			data: {
				...data,
				balance: balanceFloat,
				userId,
				isDefault: shouldBeDefault,
			},
		});

		const serializedAccount = serializeTransaction(account);

		revalidatePath("/dashboard");

		return { success: true, data: serializedAccount };
	} catch (error) {
		const err = error as Error;
		throw new Error(err.message || "Failed to create account");
	}
}

export async function getUserAccounts(): Promise<SerializedAccount[]> {
	const session = await authRequired();
	const userId = session.user.id;

	const accounts = await prisma.financialAccount.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
		include: {
			_count: {
				select: {
					transactions: true,
				},
			},
		},
	});

	return accounts.map(serializeTransaction);
}

export type SerializedTransaction = {
	id: string;
	accountId: string;
	type: "EXPENSE" | "INCOME";
	amount: number;
	description?: string;
	date: Date;
	category: string;
	receiptUrl?: string;
	isRecurring: boolean;
	recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
	nextRecurringDate?: Date;
	lastProcessed?: Date;
	status: "PENDING" | "COMPLETED" | "FAILED";
	userId: string;
	createdAt: Date;
	updatedAt: Date;
};

interface TransactionWithDecimalAmount
	extends Omit<
		SerializedTransaction,
		| "amount"
		| "description"
		| "receiptUrl"
		| "recurringInterval"
		| "nextRecurringDate"
		| "lastProcessed"
	> {
	amount: { toNumber: () => number };
	description?: string | null;
	receiptUrl?: string | null;
	recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | null;
	nextRecurringDate?: Date | null;
	lastProcessed?: Date | null;
}

const serializeTransactionData = (
	obj: TransactionWithDecimalAmount,
): SerializedTransaction => {
	const serialized = { ...obj, amount: obj.amount.toNumber() } as unknown as SerializedTransaction;
	return serialized;
};

export async function getDashboardData(): Promise<SerializedTransaction[]> {
	const session = await authRequired();
	const userId = session.user.id;

	const transactions = await prisma.transaction.findMany({
		where: { userId },
		orderBy: { date: "desc" },
	});

	return transactions.map(serializeTransactionData);
}
