import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Enter your email address"),
  password: z.string().min(1, "Enter your password").max(200),
});

export type SignInInput = z.infer<typeof signInSchema>;
