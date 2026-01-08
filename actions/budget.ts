"use server";

import { revalidatePath } from "next/cache";
import { authRequired } from "@/lib/auth/auth-utils";
import prisma from "@/lib/prisma";

export async function getCurrentBudget(accountId: string): Promise<{
	budget: { id: string; userId: string; amount: number } | null;
	currentExpenses: number;
}> {
	try {
		const session = await authRequired();
		const userId = session.user.id;

		const budget = await prisma.budget.findFirst({
			where: {
				userId,
			},
		});

		// Get current month's expenses
		const currentDate = new Date();
		const startOfMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			1,
		);
		const endOfMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + 1,
			0,
		);

		const expenses = await prisma.transaction.aggregate({
			where: {
				userId,
				type: "EXPENSE",
				date: {
					gte: startOfMonth,
					lte: endOfMonth,
				},
				accountId,
			},
			_sum: {
				amount: true,
			},
		});

		return {
			budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
			currentExpenses: expenses._sum.amount
				? expenses._sum.amount.toNumber()
				: 0,
		};
	} catch (error) {
		console.error("Error fetching budget:", error);
		throw error;
	}
}

export async function updateBudget(
	amount: number,
): Promise<
	| { success: true; data: { id: string; userId: string; amount: number } }
	| { success: false; error: string }
> {
	try {
		const session = await authRequired();
		const userId = session.user.id;

		// Update or create budget
		const budget = await prisma.budget.upsert({
			where: {
				userId,
			},
			update: {
				amount,
			},
			create: {
				userId,
				amount,
			},
		});

		revalidatePath("/dashboard");
		return {
			success: true,
			data: { ...budget, amount: budget.amount.toNumber() },
		};
	} catch (error) {
		console.error("Error updating budget:", error);
		return { success: false, error: (error as Error).message };
	}
}
