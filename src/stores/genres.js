import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"
import {useLoadingStore} from '@/stores/loading';

export const useGenresStore = defineStore("genre", {
    state: () => ({
        genres: [],
        isLoading: useLoadingStore(),

    }),
    getters: {
        getGenres(state) {
            return state.genres.data
        }
    },
    actions: {
        async fetchGenres() {
            this.isLoading.showLoading()
            try {
                const data = await axios.get('http://127.0.0.1:8000/api/genres')
                this.genres = data.data
                console.log("from store", this.genres)
            } catch (error) {
                alert(error)
                console.log(error)
            } finally {
                this.isLoading.hideLoading()
            }
        }
    },
})