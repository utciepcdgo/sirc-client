import { defineStore } from 'pinia';
// Import axios to make HTTP requests
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { Block } from '@/types/types';

export const useBlocksStore = defineStore('block', {
	state: () => ({
		blocks: [] as Block[],
		isLoading: useLoadingStore(),
		blocksError: null as unknown,
	}),
	getters: {
		getBlocks(state) {

			// Ensure state.blocks is always an array
			if (!Array.isArray(state.blocks)) {
				return [];
			}

			return state.blocks.map((block) => ({
				id: block.id,
				uuid: block.uuid,
				votes_obtained: block.votes_obtained,
				valid_vote_issued: block.valid_vote_issued,
				municipality: {
					id: block.municipality.id,
					name: block.municipality.name,
					shield: block.municipality.shield,
					councils: block.municipality.councils,
				},
				entity: {
					id: block.entity.id,
					entitiable_type: block.entity.entitiable_type,
					name: block.entity.name,
					acronym: block.entity.acronym,
					logo: block.entity.logo,
				},
				registrations: {
					stats: {
						total: block.registrations.stats.total,
						women: block.registrations.stats.women,
						man: block.registrations.stats.man,
						compensatories:
							block.registrations.stats.compensatories,
					},
					list: block.registrations,
				},
				assignments: {
					municipality: block.assignments.municipality,
					syndic: block.assignments.syndic,
					councils: block.assignments.councils,
				},
			}));
		},
	},
	actions: {
		async fetchBlocks() {
			this.isLoading.showLoading('Obteniendo información de los registros');
			this.blocksError = null;

			const authStore = useAuthStore();

			// Ensure user is loaded
			if (!authStore.user) {
				console.warn('El usuario no está cargado.');
				return;
			}

			// Ensure user has entities
			if (
				!authStore.user.entities ||
				authStore.user.entities.length === 0
			) {
				console.warn('El usuario no tiene entidades asociadas.');
				this.isLoading.hideLoading();
				return;
			}

			try {
				const response = await axios.get(
					import.meta.env.VITE_SIRC_API_URI +
						`blocks?filters[entity][id][$in][]=${authStore.user.entities[0].id}`
				);

				// Ensure `blocks` is assigned correctly
				this.blocks = Array.isArray(response.data.data)
					? response.data.data
					: [];
			} catch (error) {
				this.blocksError =
					error instanceof Error
						? error.message
						: 'Error desconocido';
				alert('Error al obtener los municipios correspondientes: ' + this.blocksError);
			} finally {
				this.isLoading.hideLoading();
			}
		},
	},
});
