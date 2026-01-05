import { seedTransactions } from "@/prisma/seed";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    const result = await seedTransactions();
    return NextResponse.json(result);
}