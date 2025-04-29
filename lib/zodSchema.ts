import { z } from "zod"

export const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["CURRENT", "SAVINGS"]),
    balance: z.string().min(1, "Initial balance is required"),
    isDefault: z.boolean().default(false)
})

export type AccountSchema = z.infer<typeof accountSchema>

// z.infer<typeof accountSchema> is a powerful feature of Zod.
// It extracts the TypeScript type from your schema automatically.
// This means you don't have to manually write the type interface — Zod generates it for you.