"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type SerializedAccount = {
    balance: number;
};

const serializeTransaction = (obj: any): SerializedAccount => {
    const serialized = { ...obj } as SerializedAccount;

    if (obj.balance) { // Convert Decimal fields (Prisma uses Decimal.js)
        serialized.balance = obj.balance.toNumber();
    }
    return serialized;
};

interface CreateAccountInput {
    name: string;
    type: "CURRENT" | "SAVINGS";
    balance: string; // Will convert to float
    isDefault: boolean;
}

interface CreateAccountResponse {
    success: boolean;
    data: SerializedAccount;
}

export async function createAccount(data: CreateAccountInput): Promise<CreateAccountResponse> {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        const balanceFloat = parseFloat(data.balance);
        if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

        const existingAccounts = await prisma.account.findMany({
            where: { userId: user.id },
        });

        const shouldBeDefault = existingAccounts.length === 0 || data.isDefault;

        if (shouldBeDefault) {
            await prisma.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        const account = await prisma.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            },
        });

        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard"); // it refetch the value of this page

        return { success: true, data: serializedAccount };
    } catch (error) {
        const err = error as Error
        throw new Error(err.message || "Failed to create account");
    }
}


export async function getUserAccounts(): Promise<SerializedAccount[]> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const accounts = await prisma.account.findMany({
        where: { userId: user.id },
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