import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"

interface Postulation {
    id: number,
    name: string
    active: boolean
}

export const usePostulationsStore = defineStore("postulation", {
    state: () => ({
        postulations: [] as Postulation[],
    }),
    getters: {
        getPostulations(state) {
            return state.postulations
        }
    },
    actions: {
        async fetchPostulations() {
            try {
                const data = await axios.get(import.meta.env.VITE_SIRC_API_URI + 'postulations')
                this.postulations = data.data
            } catch (error) {
                alert(error)
                console.log(error)
            }
        }
    },
})