import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useLoadingStore = defineStore('loading', () => {
    const isLoading = ref(false);

    const showLoading = () => {
        isLoading.value = true;
    };
    const hideLoading = () => {
        isLoading.value = false;
    };

    return {isLoading, showLoading, hideLoading};
});