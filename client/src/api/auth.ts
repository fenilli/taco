import { apiClient } from "../config/axios-client";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: { user_id: string; email: string; };
}

export const login = async (data: LoginPayload): Promise<LoginResponse> =>
    apiClient.post("/auth/login", data)
