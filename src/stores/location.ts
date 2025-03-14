import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import axios from 'axios';

export const useLocationStore = defineStore('location', () => {
	// State selection
	const selectedStateBorn = ref(null);
	const selectedStateResidence = ref(null);

	// Municipality selection
	const selectedMunicipalityBorn = ref(null);
	const selectedMunicipalityResidence = ref(null);

	// Lists
	const states = ref([]);
	const municipalities = ref([]);

	// Fetch States
	const fetchStates = async () => {
		try {
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
		} catch (error) {
			console.error('Error fetching states:', error);
		}
	};

	// Fetch Municipalities based on selected state
	const fetchMunicipalities = async (stateId) => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_SERVICES_API_URI +
					`municipalities/${stateId}`,
				{
					headers: {
						authorization:
							'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN,
					},
				}
			);
			municipalities.value = response.data.data;
		} catch (error) {
			console.error('Error fetching municipalities:', error);
		}
	};

	// Watch for changes and fetch municipalities dynamically
	watch(selectedStateBorn, (newState) => {
		if (newState) fetchMunicipalities(newState);
		selectedMunicipalityBorn.value = null;
	});

	watch(selectedStateResidence, (newState) => {
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
