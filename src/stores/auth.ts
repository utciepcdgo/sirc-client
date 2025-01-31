import {defineStore} from "pinia";
import axios from "axios";
import {useRouter} from "vue-router";
import { useBlocksStore } from "@/stores/blocks";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token: localStorage.getItem("token") || null,
        entities: [],
        route: useRouter()
    }),

    actions: {
        async login(credentials) {
            try {
                const response = await axios.post(import.meta.env.VITE_SIRC_API_URI + "login", credentials);
                console.log("Login response:", response.data);
                this.token = response.data.token;
                this.user = response.data.user;
                this.entities = response.data.user.entities;

                localStorage.setItem("token", this.token);
                // api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
                // ✅ Esperar a que el usuario se guarde en el estado antes de ejecutar fetchBlocks()
                const blocksStore = useBlocksStore();
                await blocksStore.fetchBlocks();
            } catch (error) {
                console.error("Error en login:", error);
            }
        },

        async fetchUser() {
            if (!this.token) return; // Si no hay token, no hacer la petición

            try {
                const response = await axios.get(import.meta.env.VITE_SIRC_API_URI + "user", {
                    headers: {Authorization: `Bearer ${this.token}`},
                });

                this.user = response.data;
                this.entities = response.data.entities;

            } catch (error) {
                console.error("No autenticado:", error.response?.data || error);
                await this.logout();
            }
        },

        async logout() {
            try {
                // Opcional: Hacer una petición a la API para cerrar sesión en el backend
                await axios.post(import.meta.env.VITE_SIRC_API_URI + "logout", {}, {headers: {Authorization: `Bearer ${this.token}`}})
            } catch (error) {
                console.error("Error al cerrar sesión en el backend", error);
            }

            // 1️⃣ Eliminar el token y los datos del usuario
            localStorage.removeItem("token");
            this.token = null;
            this.user = null;
            delete axios.defaults.headers.common["Authorization"];

            // 2️⃣ Redirigir al usuario a la pantalla de login
            await this.route.push("/login");
        },
    },
});