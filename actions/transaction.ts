"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { authRequired } from "@/lib/auth/auth-utils";
import prisma from "@/lib/prisma";

const serializeAmount = (
	obj: { amount: { toNumber: () => number } } & Record<string, unknown>,
) => ({
	...obj,
	amount: obj.amount.toNumber(),
});

interface CreateTransactionData {
	type: "EXPENSE" | "INCOME";
	amount: number;
	description?: string;
	date: Date;
	accountId: string;
	category: string;
	isRecurring?: boolean;
	recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
}

export async function createTransaction(data: CreateTransactionData) {
	try {
		const session = await authRequired();
		const userId = session.user.id;

		const account = await prisma.financialAccount.findUnique({
			where: {
				id: data.accountId,
				userId,
			},
		});

		if (!account) {
			throw new Error("Account not found. Please select a valid account.");
		}

		const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
		const newBalance = account.balance.toNumber() + balanceChange;
		const transaction = await prisma.$transaction(async (tx) => {
			const newTransaction = await tx.transaction.create({
				data: {
					...data,
					userId,
					nextRecurringDate:
						data.isRecurring && data.recurringInterval
							? calculateNextRecurringDate(data.date, data.recurringInterval)
							: null,
				},
			});

			await tx.financialAccount.update({
				where: { id: data.accountId },
				data: { balance: newBalance },
			});

			return newTransaction;
		});

		revalidatePath("/dashboard");
		revalidatePath(`/account/${transaction.accountId}`);

		return {
			success: true,
			data: serializeAmount(transaction),
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to create transaction";
		throw new Error(errorMessage);
	}
}

export type SerializedTransactionForForm = {
	id: string;
	type: "EXPENSE" | "INCOME";
	amount: number;
	description: string | null;
	accountId: string;
	category: string;
	date: Date;
	isRecurring: boolean;
	recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
};

export async function getTransaction(
	id: string,
): Promise<SerializedTransactionForForm> {
	const session = await authRequired();
	const userId = session.user.id;

	const transaction = await prisma.transaction.findUnique({
		where: {
			id,
			userId,
		},
	});

	if (!transaction) throw new Error("Transaction not found");

	return serializeAmount(transaction) as unknown as SerializedTransactionForForm;
}

export async function updateTransaction(
	id: string,
	data: Partial<CreateTransactionData>,
) {
	try {
		const session = await authRequired();
		const userId = session.user.id;

		const originalTransaction = await prisma.transaction.findUnique({
			where: {
				id,
				userId,
			},
			include: {
				account: true,
			},
		});

		if (!originalTransaction) throw new Error("Transaction not found");

		const oldBalanceChange =
			originalTransaction.type === "EXPENSE"
				? -originalTransaction.amount.toNumber()
				: originalTransaction.amount.toNumber();

		const newBalanceChange =
			data.type === "EXPENSE" ? -(data.amount ?? 0) : (data.amount ?? 0);

		const netBalanceChange = newBalanceChange - oldBalanceChange;

		const transaction = await prisma.$transaction(async (tx) => {
			const updated = await tx.transaction.update({
				where: {
					id,
					userId,
				},
				data: {
					...data,
					nextRecurringDate:
						data.isRecurring && data.recurringInterval && data.date
							? calculateNextRecurringDate(data.date, data.recurringInterval)
							: null,
				} as Parameters<typeof tx.transaction.update>[0]["data"],
			});

			await tx.financialAccount.update({
				where: { id: data.accountId },
				data: {
					balance: {
						increment: netBalanceChange,
					},
				},
			});

			return updated;
		});

		revalidatePath("/dashboard");
		revalidatePath(`/account/${data.accountId}`);

		return { success: true, data: serializeAmount(transaction) };
	} catch (error) {
		throw new Error((error as Error).message);
	}
}

export async function getUserTransactions(query = {}) {
	try {
		const session = await authRequired();
		const userId = session.user.id;

		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
				...query,
			},
			include: {
				account: true,
			},
			orderBy: {
				date: "desc",
			},
		});

		return { success: true, data: transactions };
	} catch (error) {
		throw new Error((error as Error).message);
	}
}

interface ScannedReceiptData {
	amount: number;
	date: Date;
	description: string;
	category: string;
	merchantName: string;
}

export async function scanReceipt(file: File): Promise<ScannedReceiptData> {
	try {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) {
			throw new Error("AI service not configured. Please contact support.");
		}
		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const arrayBuffer = await file.arrayBuffer();
		const base64String = Buffer.from(arrayBuffer).toString("base64");

		const prompt = `
            Analyze this receipt image and extract the following information in JSON format:
            - Total amount (just the number)
            - Date (in ISO format)
            - Description or items purchased (brief summary)
            - Merchant/store name
            - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense)
            
            Only respond with valid JSON in this exact format:
            {
              "amount": number,
              "date": "ISO date string",
              "description": "string",
              "merchantName": "string",
              "category": "string"
            }

            If it's not a receipt, return an empty object.
        `;

		const result = await model.generateContent([
			{
				inlineData: {
					data: base64String,
					mimeType: file.type,
				},
			},
			prompt,
		]);

		const response = await result.response;
		const text = response.text();
		const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

		const data = JSON.parse(cleanedText);

		if (!data.amount || !data.date || !data.category) {
			throw new Error(
				"Could not extract all required information from the receipt",
			);
		}

		return {
			amount: parseFloat(data.amount),
			date: new Date(data.date),
			description: data.description || "Receipt scan",
			category: data.category,
			merchantName: data.merchantName || "Unknown merchant",
		};
	} catch (error) {
		console.error("Error scanning receipt:", error);

		if (error instanceof Error) {
			throw new Error(`Failed to scan receipt: ${error.message}`);
		}
		throw new Error(
			"Failed to scan receipt. Please try again or enter the information manually.",
		);
	}
}

function calculateNextRecurringDate(
	startDate: Date | string,
	interval: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
) {
	const date = new Date(startDate);

	switch (interval) {
		case "DAILY":
			date.setDate(date.getDate() + 1);
			break;
		case "WEEKLY":
			date.setDate(date.getDate() + 7);
			break;
		case "MONTHLY":
			date.setMonth(date.getMonth() + 1);
			break;
		case "YEARLY":
			date.setFullYear(date.getFullYear() + 1);
			break;
	}

	return date;
}
