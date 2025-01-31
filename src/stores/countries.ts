import {defineStore} from 'pinia'
// Import axios to make HTTP requests
import axios from "axios"
import {useLoadingStore} from '@/stores/loading';

export const useCountriesStore = defineStore("country", {
    state: () => ({
        countries: [],
        isLoading: useLoadingStore(),
        countriesError: null,
    }),
    getters: {
        getCountries(state) {
            return state.countries.data
        }
    },
    actions: {
        async fetchCountries() {
            // Set isLoading to true to show a loading spinner
            this.isLoading.showLoading()
            try {
                const data = await axios.get('http://127.0.0.1:8000/api/countries')
                this.countries = data.data
            } catch (error) {
                // alert(error)
                this.countriesError = error
                console.log(error)
            } finally {
                // Set isLoading to false for hide the loading spinner
                this.isLoading.hideLoading()
            }
        }
    },
})