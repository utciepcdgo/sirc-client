import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"

export const useCompensatoriesStore = defineStore("compensatory", {
    state: () => ({
        compensatories: [],
        isLoading: false,
        compensatoriesError: null,
    }),
    getters: {
        getBlocks(state) {
            return state.compensatories.data
        }
    },
    actions: {
        async fetchBlocks() {
            // Set isLoading to true to show a loading spinner
            this.isLoading = true
            try {
                const data = await axios.get('http://127.0.0.1:8000/api/compensatories')
                this.compensatories = data.data
            } catch (error) {
                // alert(error)
                this.compensatoriesError = error
                console.log(error)
            } finally {
                // Set isLoading to false to hide the loading spinner
                this.isLoading = false
            }
        }
    },
})