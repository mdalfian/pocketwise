import { z } from "zod";

export const transactionTypeSchema = z.enum(["income", "expense", "transfer"]);

export const transactionInputSchema = z.object({
  accountId: z.string().uuid(),
  toAccountId: z.string().uuid().optional().or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  groupId: z.string().uuid().optional().or(z.literal("")),
  type: transactionTypeSchema,
  amount: z.coerce.number().int().positive().max(9_000_000_000_000_000),
  description: z.string().trim().max(240),
  transactionDate: z.coerce.date(),
});

export type TransactionInput = z.infer<typeof transactionInputSchema>;
