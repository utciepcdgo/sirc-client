import {createApp} from 'vue'
import {createPinia} from 'pinia'
import './assets/index.css'
import router from './router'
import App from './App.vue'
import {useAuthStore} from "@/stores/auth";

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')

const authStore = useAuthStore();

// Si hay un token en localStorage, intenta recuperar la sesión
if (authStore.token) {
    authStore.fetchUser().then(r => console.log("Sesión recuperada:", r));
}

