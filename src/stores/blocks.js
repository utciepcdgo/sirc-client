import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"
import {useAuthStore} from "@/stores/auth";

export const useBlocksStore = defineStore("block", {
    state: () => ({
        blocks: [],
        isLoading: false,
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
            this.isLoading = true
            this.blocksError = null;

            const authStore = useAuthStore();

            // Esperar a que el usuario esté cargado
            if (!authStore.user) {
                console.warn("Usuario no cargado, esperando...");
                return;
            }

            // Verificar que existen entidades (Partidos P.) antes de acceder a ellas
            if (!authStore.user.entities || authStore.user.entities.length === 0) {
                console.warn("El usuario no tiene entidades asociadas.");
                return;
            }

            try {
                const data = await axios.get(`http://127.0.0.1:8000/api/blocks?filters[entity][id][$in][]=${authStore.entities[0].id}`)
                this.blocks = data.data
            } catch (error) {
                // alert(error)
                this.blocksError = error.message || "Error desconocido";
                alert("Error al obtener blocks: " + error);
            } finally {
                // Set isLoading to false to hide the loading spinner
                this.isLoading = false
            }
        }
    },
})