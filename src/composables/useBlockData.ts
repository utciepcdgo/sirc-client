// useBlocksData.ts
import { computed, ref } from 'vue';
import { useLoadingStore } from '@/stores/loading';
import { useBlocksStore } from '@/stores/blocks.js';

export function useBlocksData() {
  const store = useBlocksStore();
  const loadingStore = useLoadingStore();
  const blocks = computed(() => store.getBlocks || []);
  const error = ref(null);

  const fetchBlocks = async () => {
    loadingStore.showLoading();
    try {
      await store.fetchBlocks();
    } catch (err) {
      error.value = err;
      loadingStore.hideLoading();
      // Aquí podrías invocar un servicio de notificaciones
    }
    loadingStore.hideLoading();
  };

  const filterBlocks = (
    search: string,
    onlyRegistrations: boolean,
    onlyCompensatories: boolean
  ) => {
    return blocks.value.filter((block) => {
      const matchesSearch = block.municipality.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const hasRegistrations = block.registrations?.stats?.total > 0;
      const hasCompensatories = block.registrations?.stats?.compensatories > 0;

      if (onlyRegistrations && onlyCompensatories) {
        return matchesSearch && hasRegistrations && hasCompensatories;
      } else if (onlyRegistrations) {
        return matchesSearch && hasRegistrations;
      } else if (onlyCompensatories) {
        return matchesSearch && hasCompensatories;
      } else {
        return matchesSearch;
      }
    });
  };

  return { blocks, error, fetchBlocks, filterBlocks };
}
