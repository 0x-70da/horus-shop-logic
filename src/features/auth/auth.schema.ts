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

export const verifyCodeOrResetTokenSchema = z.object({
  code: z.string().length(6, { error: "Code must be exactly 6 characters" }).toUpperCase().optional(),
  token: z.string().min(1, { error: "Reset token is required" }).optional(),
}).refine((data) => data.code || data.token, {
  message: "Either code or token must be provided",
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, { error: "New password must be at least 6 characters long" }),
  confirmNewPassword: z.string().min(6, { error: "Confirm new password must be at least 6 characters long" }),
  resetToken: z.string().min(1, { error: "Reset token is required" }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
});

export type ValidatedRegisterBody = z.infer<typeof registerSchema>;
export type ValidatedLoginBody = z.infer<typeof loginSchema>;
export type ValidatedForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
export type ValidatedVerifyCodeOrResetTokenBody = z.infer<typeof verifyCodeOrResetTokenSchema>;
export type ValidatedResetPasswordBody = z.infer<typeof resetPasswordSchema>;
