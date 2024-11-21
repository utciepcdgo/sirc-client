import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"

export const useGenresStore = defineStore("genre", {
    state: () => ({
        genres: [],
    }),
    getters: {
        getGenres(state) {
            return state.genres.data
        }
    },
    actions: {
        async fetchGenres() {
            try {
                const data = await axios.get('http://127.0.0.1:8000/api/genres')
                this.genres = data.data
                console.log("from store", this.genres)
            }
            catch (error) {
                alert(error)
                console.log(error)
            }
        }
    },
})