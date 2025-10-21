import { apiClient } from '../config/axios-client';

export type Session = {
    session_id: number;
    is_current?: boolean;
    user_agent?: string;
    created_at: Date;
    expires_at: Date;
};

export interface AllSessionsResponse {
    sessions: Session[]
}

export const getSessions = async (): Promise<AllSessionsResponse> => apiClient.get('/sessions');

export const deleteSession = async (session_id: number) => apiClient.delete(`/sessions/${session_id}`);
