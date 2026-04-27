import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, { error: "First name is required" }),
  lastName: z.string().min(1, { error: "Last name is required" }),
  email: z.string().email({ error: "Invalid email address" }),
  password: z.string().min(6, { error: "Password must be at least 6 characters long" }),
});

export const loginSchema = z.object({
  email: z.string().email({ error: "Invalid email address" }),
  password: z.string().min(6, { error: "Password must be at least 6 characters long" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ error: "Invalid email address" }),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { error: "Reset token is required" }).optional(),
  code: z.string().min(6, { error: "Reset code must be 6 characters long" }).optional(),
  newPassword: z.string().min(6, { error: "New password must be at least 6 characters long" }),
}).refine((data) => data.token || data.code, {
  error: "Either reset token or reset code must be provided",
});

export type ValidatedRegisterBody = z.infer<typeof registerSchema>;
export type ValidatedLoginBody = z.infer<typeof loginSchema>;
export type ValidatedForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
export type ValidatedResetPasswordBody = z.infer<typeof resetPasswordSchema>;
