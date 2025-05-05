import { Inngest } from "inngest";

interface RetryFunctionResult {
    delay: number;
    maxAttempts: number;
}

// Create a client to send and receive events
export const inngest = new Inngest({
    id: "expense-hero",
    name: "ExpenseHero",
    retryFunction: async (attempt: number): Promise<RetryFunctionResult> => ({
        delay: Math.pow(2, attempt) * 1000, // exponential backoff
        maxAttempts: 2
    })
});
