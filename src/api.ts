import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SIRC_API_URI,
    withCredentials: true,
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
});

export default api;