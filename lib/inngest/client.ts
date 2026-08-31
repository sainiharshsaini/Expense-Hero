import { Inngest } from "inngest";

export const inngest = new Inngest({
	id: "expense-hero",
	name: "ExpenseHero",
	retryFunction: async (attempt: number) => ({
		delay: 2 ** attempt * 1000,
		maxAttempt: 2,
	}),
});
