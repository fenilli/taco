import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AllSessionsResponse, deleteSession, Session } from "../api/sessions";
import { SESSIONS } from "./use-sessions";

export const useDeleteSession = (session_id: number) => {
    const queryClient = useQueryClient();

    const { mutate, ...rest } = useMutation({
        mutationFn: () => deleteSession(session_id),
        onSuccess: () => {
            queryClient.setQueryData<AllSessionsResponse>([SESSIONS], (cache) => {
                if (!cache) return cache;

                return {
                    ...cache,
                    sessions: cache.sessions.filter((session) => session.session_id !== session_id)
                };
            });
        }
    });

    return {
        deleteSession: mutate,
        ...rest,
    };
};
