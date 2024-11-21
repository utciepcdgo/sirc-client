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
                const data = await axios.get('http://127.0.0.1:8000/api/sexes')
                this.sexes = data.data
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        }
    },
})