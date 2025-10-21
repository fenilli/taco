import { apiClient } from "../config/axios-client";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user: { user_id: string; email: string; };
}

export const login = async (data: LoginPayload): Promise<LoginResponse> =>
    apiClient.post("/auth/login", data)

export const logout = async () =>
    apiClient.get("/auth/logout")

export interface RegisterPayload {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    message: string;
}

export const register = async (data: RegisterPayload): Promise<RegisterResponse> =>
    apiClient.post("/auth/register", data)
