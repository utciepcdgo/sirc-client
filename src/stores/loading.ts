import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useLoadingStore = defineStore('loading', () => {
    const isLoading = ref(false);
    const loadingText = ref<String>('Cargando...');

    const showLoading = (text) => {
        isLoading.value = true;
        loadingText.value = text
    };
    const hideLoading = () => {
        isLoading.value = false;
    };

    return {isLoading, showLoading, hideLoading, loadingText};
});