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

const serializeTransaction = (obj: any): SerializedAccount => {
	const serialized = { ...obj } as SerializedAccount;

	if (obj.balance) {
		serialized.balance = obj.balance.toNumber();
	}
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
		if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

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

const serializeTransactionData = (obj: any): SerializedTransaction => {
	const serialized = { ...obj } as SerializedTransaction;

	if (obj.amount) {
		serialized.amount = obj.amount.toNumber();
	}
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
