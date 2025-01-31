import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"

export const useSexesStore = defineStore("sex", {
    state: () => ({
        sexes: [],
    }),
    getters: {
        getSexes(state) {
            return state.sexes.data
        }
    },
    actions: {
        async fetchSexes() {
            try {
                const data = await axios.get(import.meta.env.VITE_SIRC_API_URI + 'sexes')
                this.sexes = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        }
    },
})