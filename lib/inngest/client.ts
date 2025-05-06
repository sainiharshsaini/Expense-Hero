import { Inngest } from "inngest";

interface RetryFunctionResult {
    delay: number;
    maxAttempts: number;
}

// Create a client to send and receive events
export const inngest = new Inngest({ //  This creates a new instance of the Inngest class that you imported earlier. This instance is your connection to the Inngest platform.
    id: "expense-hero", // This is a unique identifier for your Inngest client within your Inngest account
    name: "ExpenseHero", // This is a human-readable name for your Inngest client
    retryFunction: async (attempt: number): Promise<RetryFunctionResult> => ({ // This is a crucial configuration option that allows you to define a custom strategy for how Inngest should retry failed function executions. Instead of using Inngest's default retry mechanism, you're providing your own.
        delay: Math.pow(2, attempt) * 1000, // exponential backoff
        maxAttempts: 2
    })
});
