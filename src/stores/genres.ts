import { defineStore } from 'pinia';
// Import axios to make HTTP requests
import axios from 'axios';
import { useLoadingStore } from '@/stores/loading';
import { Genre } from '@/types/types';

export const useGenresStore = defineStore('genre', {
	state: () => ({
		genres: [] as Genre[],
		isLoading: useLoadingStore(),
	}),
	getters: {
		getGenres(state) {
			if (!Array.isArray(state.genres)) {
				console.error(
					'getBlocks: state.genres is not an array',
					state.genres
				);
				return [];
			}

			return state.genres.map((genre) => ({
				id: genre.id,
				name: genre.name,
			}));
		},
	},
	actions: {
		async fetchGenres() {
			this.isLoading.showLoading();
			try {
				const response = await axios.get(
					import.meta.env.VITE_SIRC_API_URI + 'genres'
				);

				this.genres = Array.isArray(response.data.data)
					? response.data.data
					: [];
				console.log('from store', this.genres);
			} catch (error) {
				alert(error);
				console.log(error);
			} finally {
				this.isLoading.hideLoading();
			}
		},
	},
});
