import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"
import {useAuthStore} from "@/stores/auth";
import { useLoadingStore } from '@/stores/loading';

export const useBlocksStore = defineStore("block", {
    state: () => ({
        blocks: [],
        isLoading: useLoadingStore(),
        blocksError: null,
    }),
    getters: {
        getBlocks(state) {
            return state.blocks.data
        }
    },
    actions: {
        async fetchBlocks() {
            // Set isLoading to true to show a loading spinner
            this.isLoading.showLoading()
            this.blocksError = null;

            const authStore = useAuthStore();
            console.log("Punto alcanzado");
            console.log("authStore", authStore.entities[0].id);

            // Esperar a que el usuario esté cargado
            if (!authStore.user) {
                console.warn("Usuario no cargado, esperando...");
                // this.isLoading = false;
                return;
            }

            // Verificar que existen entidades (Partidos P.) antes de acceder a ellas
            if (!authStore.user.entities || authStore.user.entities.length === 0) {
                console.warn("El usuario no tiene entidades asociadas.");
                // this.isLoading = false;
                return;
            }

            console.log("Pasa la validación");

            try {
                const data = await axios.get(`http://127.0.0.1:8000/api/blocks?filters[entity][id][$in][]=${authStore.user.entities[0].id}`)
                this.blocks = data.data
            } catch (error) {
                this.blocksError = error.message || "Error desconocido";
                alert("Error al obtener blocks: " + error);
            } finally {
                this.isLoading.hideLoading()
            }
        }
    },
})