import { defineStore } from 'pinia';
// Import axios to make HTTP requests
import axios from 'axios';
import { useLoadingStore } from '@/stores/loading';

interface Country {
	id: number;
	name: string;
	alpha3: string;
}

export const useCountriesStore = defineStore('country', {
	state: () => ({
		countries: [] as Country[],
		isLoading: useLoadingStore(),
		countriesError: null as unknown,
	}),
	getters: {
		getCountries(state) {
			return state.countries;
		},
	},
	actions: {
		async fetchCountries() {
			// Set isLoading to true to show a loading spinner
			this.isLoading.showLoading('Cargando información...');
			try {
				const response = await axios.get(
					import.meta.env.VITE_SIRC_API_URI + 'countries'
				);
				this.countries = response.data.data;
			} catch (error) {
				// alert(error)
				this.countriesError = error;
				console.log(error);
			} finally {
				// Set isLoading to false for hide the loading spinner
				this.isLoading.hideLoading();
			}
		},
	},
});
