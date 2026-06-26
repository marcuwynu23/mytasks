import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "at least 8 characters")
  .regex(/[A-Z]/, "an uppercase letter")
  .regex(/[a-z]/, "a lowercase letter")
  .regex(/[0-9]/, "a number")
  .regex(/[^A-Za-z0-9]/, "a symbol");

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string().trim().optional().default(""),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).optional(),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});
