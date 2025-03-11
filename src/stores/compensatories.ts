import { defineStore } from 'pinia'; // Import axios to make HTTP requests
import axios from 'axios';
import { Compensatory } from '@/types/types';
import { useLoadingStore } from '@/stores/loading';

export const useCompensatoryStore = defineStore('compensatory', {
	state: () => ({
		compensatory: [] as Compensatory[],
		compensatoryError: null as unknown,
		isLoading: useLoadingStore(),
	}),
	getters: {
		getCompensatory(state) {
			console.info('State compensatory:', state.compensatory);

			if (!Array.isArray(state.compensatory)) {
				console.error(
					'getBlocks: state.compensatory is not an array',
					state.compensatory
				);
				return [];
			}

			return state.compensatory.map((compensatory) => ({
				id: compensatory.id,
				name: compensatory.name,
			}));
		},
	},
	actions: {
		async fetchCompensatory() {
			// Set isLoading to true to show a loading spinner
			this.isLoading.showLoading();

			try {
				const response = await axios.get(
					import.meta.env.VITE_SIRC_API_URI + 'compensatories'
				);
				// this.compensatory = data.data;
				console.log('compensatories: ', response.data.data);
				this.compensatory = Array.isArray(response.data.data)
					? response.data.data
					: [];
			} catch (error) {
				// alert(error)
				this.compensatoryError = error;
			} finally {
				// Set isLoading to false to hide the loading spinner
				this.isLoading.hideLoading();
			}
		},
	},
});
