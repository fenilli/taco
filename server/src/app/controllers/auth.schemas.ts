import z from "zod";

export const loginSchema = z.object({
    email: z.email().min(1).max(255),
    password: z.string().min(6).max(255),
    userAgent: z.string().optional(),
});

export const registerSchema = loginSchema.extend({
    confirmPassword: z.string().min(6).max(255),
}).refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
});