import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useLoadingStore } from '@/stores/loading';
import axios from 'axios';
import { Municipality, State } from '@/types/types';

export const useLocationStore = defineStore('location', () => {
	// State selection
	const selectedStateBorn = ref<String>(null);
	const selectedStateResidence = ref<String>(null);

	// Municipality selection
	const selectedMunicipalityBorn = ref<Municipality>(null);
	const selectedMunicipalityResidence = ref<Municipality>(null);

	const isLoading = useLoadingStore();
	// Lists
	const states = ref<State[]>([]);
	const municipalities = ref<Municipality[]>([]);

	// Fetch States
	const fetchStates = async () => {
		try {
			isLoading.showLoading('Cargando información de Estados...');
			const response = await axios.get(
				import.meta.env.VITE_SERVICES_API_URI + 'states',
				{
					headers: {
						authorization:
							'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN,
					},
				}
			);
			states.value = response.data.data;
			isLoading.hideLoading();
		} catch (error) {
			console.error('Error fetching states:', error);
			isLoading.hideLoading();
		}
	};

	// Fetch Municipalities based on selected state
	const fetchMunicipalities = async (state: string) => {
		// Pa' que se vea más bonito 🤭
		let lowerCaseStateName = state.toLowerCase();
		let capitalizeStateName =
			lowerCaseStateName.charAt(0).toUpperCase() +
			lowerCaseStateName.slice(1);

		try {
			isLoading.showLoading(
				`Cargando información del Estado de ${capitalizeStateName} ...`
			);
			const response = await axios.get(
				import.meta.env.VITE_SERVICES_API_URI +
					`municipalities?search_by=name&name=${state}`,
				{
					headers: {
						authorization:
							'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN,
					},
				}
			);
			municipalities.value = response.data.data;
			isLoading.hideLoading();
		} catch (error) {
			console.error('Error al intentar obtener los municipios:', error);
			isLoading.hideLoading();
		}
	};

	// Watch for changes and fetch municipalities dynamically
	watch(selectedStateBorn, (newState: string) => {
		if (newState) fetchMunicipalities(newState);
		selectedMunicipalityBorn.value = null;
	});

	watch(selectedStateResidence, (newState: string) => {
		if (newState) fetchMunicipalities(newState);
		selectedMunicipalityResidence.value = null;
	});

	return {
		states,
		municipalities,
		selectedStateBorn,
		selectedStateResidence,
		selectedMunicipalityBorn,
		selectedMunicipalityResidence,
		fetchStates,
		fetchMunicipalities,
	};
});
