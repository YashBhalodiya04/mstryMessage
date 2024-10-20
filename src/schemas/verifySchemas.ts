import { z } from "zod";

export const verifySchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
});
