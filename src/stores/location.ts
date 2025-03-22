import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useLoadingStore } from '@/stores/loading';
import axios from 'axios';

export const useLocationStore = defineStore('location', () => {
  const isLoading = useLoadingStore();

  // 📦 All available states
  const states = ref([]);

  // 🟣 Birthplace selections
  const selectedStateBirthplace = ref('');
  const selectedMunicipalityBirthplace = ref('');
  const municipalitiesBirthplace = ref([]);

  // 🟡 Residence selections
  const selectedStateResidence = ref('');
  const selectedMunicipalityResidence = ref('');
  const municipalitiesResidence = ref([]);

  // ✅ Fetch all states
  const fetchStates = async () => {
    try {
      isLoading.showLoading('Cargando información de Estados...');
      const { data } = await axios.get(import.meta.env.VITE_SERVICES_API_URI + 'states', {
        headers: {
          authorization: 'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN,
        },
      });
      states.value = data.data;
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      isLoading.hideLoading();
    }
  };

  // ✅ Generic fetch municipalities method
  const fetchMunicipalitiesByStateName = async (stateName: string) => {
    const capitalized = stateName.charAt(0).toUpperCase() + stateName.slice(1).toLowerCase();

    try {
      isLoading.showLoading(`Cargando municipios de ${capitalized}...`);
      const { data } = await axios.get(
        import.meta.env.VITE_SERVICES_API_URI + `municipalities?search_by=name&name=${stateName}`,
        {
          headers: {
            authorization: 'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN,
          },
        },
      );
      return data.data;
    } catch (error) {
      console.error('Error al obtener municipios:', error);
      return [];
    } finally {
      isLoading.hideLoading();
    }
  };

  // 🔁 Auto-watchers for dynamic update
  watch(selectedStateBirthplace, async (stateName: string) => {
    municipalitiesBirthplace.value = await fetchMunicipalitiesByStateName(stateName);
    selectedMunicipalityBirthplace.value = '';
  });

  watch(selectedStateResidence, async (stateName: string) => {
    municipalitiesResidence.value = await fetchMunicipalitiesByStateName(stateName);
    selectedMunicipalityResidence.value = '';
  });

  return {
    states,

    // Birthplace
    selectedStateBirthplace,
    selectedMunicipalityBirthplace,
    municipalitiesBirthplace,

    // Residence
    selectedStateResidence,
    selectedMunicipalityResidence,
    municipalitiesResidence,

    // Methods
    fetchStates,
    fetchMunicipalitiesByStateName,
  };
});
