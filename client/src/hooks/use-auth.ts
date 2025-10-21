import { useQuery, type DefinedInitialDataOptions } from '@tanstack/react-query';
import { getUser, type UserMeResponse } from '../api/user';

export const AUTH = 'auth';

export const useAuth = (options: Partial<DefinedInitialDataOptions> = {}) => {
    const { data, ...rest } = useQuery({
        queryKey: [AUTH],
        queryFn: getUser,
        staleTime: Infinity,
        ...options,
    });

    const user = (data as UserMeResponse)?.user;

    return {
        user,
        ...rest,
    };
};
