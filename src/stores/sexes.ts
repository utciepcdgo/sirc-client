import { defineStore } from 'pinia';
// Import axios to make HTTP requests
import axios from 'axios';

interface Sex {
	id: number;
	name: string;
}

export const useSexesStore = defineStore('sex', {
	state: () => ({
		sexes: [] as Sex[],
	}),
	getters: {
		getSexes(state) {
			if (!Array.isArray(state.sexes)) {
				console.error(
					'getBlocks: state.sexes is not an array',
					state.sexes
				);
				return [];
			}

			return state.sexes.map((sex) => ({
				id: sex.id,
				name: sex.name,
			}));
		},
	},
	actions: {
		async fetchSexes() {
			try {
				const response = await axios.get(
					import.meta.env.VITE_SIRC_API_URI + 'sexes'
				);
				this.sexes = Array.isArray(response.data.data)
					? response.data.data
					: [];
				console.log('Sexes: ', this.sexes);
			} catch (error) {
				alert(error);
				console.log(error);
			}
		},
	},
});
