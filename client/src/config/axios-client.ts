import axios from "axios";
import { queryClient } from "./query-client";
import { navigate } from "../lib/navigation";

const options = {
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
};

const tokenRefreshClient = axios.create(options);
tokenRefreshClient.interceptors.response.use(r => r.data);

export const apiClient = axios.create(options);
apiClient.interceptors.response.use(
    r => r.data,
    async e => {
        const { config, response } = e;
        const { status, data } = response || {};

        if (status === 401 && data.code === 'INVALID_ACCESS_TOKEN') {
            try {
                await tokenRefreshClient.get('/auth/refresh');
                tokenRefreshClient(config);
            } catch (e) {
                queryClient.clear();
                navigate('/login', {
                    state: {
                        redirectUrl: window.location.pathname
                    }
                });
            }
        }

        return Promise.reject({ status, ...data });
    }
);
