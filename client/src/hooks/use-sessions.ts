import { useQuery, type DefinedInitialDataOptions } from '@tanstack/react-query';
import { getSessions, type AllSessionsResponse } from '../api/sessions';

export const SESSIONS = 'sessions';

export const useSessions = (options: Partial<DefinedInitialDataOptions> = {}) => {
    const { data, ...rest } = useQuery({
        queryKey: [SESSIONS],
        queryFn: getSessions,
        ...options,
    });

    const sessions = (data as AllSessionsResponse)?.sessions || [];

    return { sessions, ...rest };
};
