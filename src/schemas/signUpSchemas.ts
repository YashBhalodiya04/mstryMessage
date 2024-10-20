import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(3, "UserName Must be atleast 2 characters")
  .max(20, "UserName Must be no more than 2 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "UserName Must be alphanumeric");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
