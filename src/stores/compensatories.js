import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"

export const useCompensatoryStore = defineStore("compensatory", {
    state: () => ({
        compensatory: [],
        isLoading: false,
        compensatoryError: null,
    }),
    getters: {
        getCompensatory(state) {
            return state.compensatory.data
        }
    },
    actions: {
        async fetchCompensatory() {
            // Set isLoading to true to show a loading spinner
            this.isLoading = true
            try {
                const data = await axios.get('http://127.0.0.1:8000/api/compensatories')
                this.compensatory = data.data
            } catch (error) {
                // alert(error)
                this.compensatoryError = error
                console.log(error)
            } finally {
                // Set isLoading to false to hide the loading spinner
                this.isLoading = false
            }
        }
    },
})