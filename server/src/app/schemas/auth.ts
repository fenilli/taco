import z from 'zod';
import { schema } from './schema';

export const LoginSchema = schema(z.object({
    email: z.email().min(1).max(255),
    password: z.string().min(6).max(255),
    userAgent: z.string().optional(),
}));

export const RegisterSchema = schema(z.object({
    email: z.email().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
}));
