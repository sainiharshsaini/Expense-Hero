"use server";

import prisma from "@/lib/prisma";
import { subDays } from "date-fns";
import { TransactionStatus } from "@/app/generated/prisma";

const ACCOUNT_ID = "9c7b55eb-3731-4a2e-bb4b-22172b2a09d2";
const USER_ID = "b2ca7aa0-0264-4b3f-bef4-c2279e275c8d";

type TransactionCategory = {
    name: string;
    range: [number, number];
};

type CategoryType = "INCOME" | "EXPENSE"

type TransactionSeed = {
    id: string;
    type: CategoryType;
    amount: number;
    description: string;
    date: Date;
    category: string;
    status: TransactionStatus;
    userId: string;
    accountId: string;
    createdAt: Date;
    updatedAt: Date;
};


// Categories with their typical amount ranges
const CATEGORIES: Record<CategoryType, TransactionCategory[]> = {
    INCOME: [
        { name: "salary", range: [5000, 8000] },
        { name: "freelance", range: [1000, 3000] },
        { name: "investments", range: [500, 2000] },
        { name: "other-income", range: [100, 1000] },
    ],
    EXPENSE: [
        { name: "housing", range: [1000, 2000] },
        { name: "transportation", range: [100, 500] },
        { name: "groceries", range: [200, 600] },
        { name: "utilities", range: [100, 300] },
        { name: "entertainment", range: [50, 200] },
        { name: "food", range: [50, 150] },
        { name: "shopping", range: [100, 500] },
        { name: "healthcare", range: [100, 1000] },
        { name: "education", range: [200, 1000] },
        { name: "travel", range: [500, 2000] },
    ],
};

// Helper to generate random amount within a range
function getRandomAmount(min: number, max: number): number {
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

// Helper to get random category with amount
function getRandomCategory(type: CategoryType): { category: string; amount: number } {
    const categories = CATEGORIES[type];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = getRandomAmount(category.range[0], category.range[1]);
    return { category: category.name, amount };
}

export async function seedTransactions(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        // Generate 90 days of transactions
        const transactions: TransactionSeed[] = [];
        let totalBalance = 0;

        for (let i = 90; i >= 0; i--) {
            const date = subDays(new Date(), i);

            // Generate 1-3 transactions per day
            const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

            for (let j = 0; j < transactionsPerDay; j++) {
                // 40% chance of income, 60% chance of expense
                const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
                const { category, amount } = getRandomCategory(type);

                const transaction: TransactionSeed = {
                    id: crypto.randomUUID(),
                    type,
                    amount,
                    description: `${type === "INCOME" ? "Received" : "Paid for"} ${category}`,
                    date,
                    category,
                    status: "COMPLETED",
                    userId: USER_ID,
                    accountId: ACCOUNT_ID,
                    createdAt: date,
                    updatedAt: date,
                };

                totalBalance += type === "INCOME" ? amount : -amount;
                transactions.push(transaction);
            }
        }

        // Insert transactions in batches and update account balance
        await prisma.$transaction(async (tx) => {
            // Clear existing transactions
            await tx.transaction.deleteMany({
                where: { accountId: ACCOUNT_ID },
            });

            // Insert new transactions
            await tx.transaction.createMany({
                data: transactions,
            });

            // Update account balance
            await tx.account.update({
                where: { id: ACCOUNT_ID },
                data: { balance: totalBalance },
            });
        });

        return {
            success: true,
            message: `Created ${transactions.length} transactions`,
        };
    } catch (error) {
        const err = error as Error
        console.error("Error seeding transactions:", err);
        return { success: false, error: err.message };
    }
}