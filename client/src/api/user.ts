import { apiClient } from "../config/axios-client";

export interface UserMeResponse {
    user: {
        user_id: string;
        email: string;
        created_at: string;
    }
}

export const getUser = async (): Promise<UserMeResponse> => apiClient.get('/users/me');
