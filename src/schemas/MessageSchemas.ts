import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Message is required")
    .max(300, "Message is no longer than 300 characters"),
});
