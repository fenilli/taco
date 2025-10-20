import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.response.use(
    r => r.data,
    e => {
        const { status, data } = e.response;
        return Promise.reject({ status, ...data });
    }
);
