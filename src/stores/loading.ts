import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
	const isLoading = ref(false);
	const loadingText = ref<string>('Cargando...');

	const showLoading = (text: string) => {
		isLoading.value = true;
		loadingText.value = text;
	};
	const hideLoading = () => {
		isLoading.value = false;
	};

	return { isLoading, showLoading, hideLoading, loadingText };
});
