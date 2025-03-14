import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'vue-router';
import { useBlocksStore } from '@/stores/blocks';
import { useLoadingStore } from '@/stores/loading';
import { User, LoginCredentials } from '@/types/types';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null as User | null,
		token: localStorage.getItem('token') || null,
		entities: [],
		route: useRouter(),
		loader: useLoadingStore(),
	}),

	actions: {
		async login(credentials: LoginCredentials) {
			try {
				const response = await axios.post(
					import.meta.env.VITE_SIRC_API_URI + 'login',
					credentials
				);
				console.log('Login response:', response.data);
				this.token = response.data.token;
				this.user = response.data.user;
				this.entities = response.data.user.entities;

				if (this.token) {
					localStorage.setItem('token', this.token);
				}
				// api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
				// Esperar a que el usuario se guarde en el estado antes de ejecutar fetchBlocks()
				const blocksStore = useBlocksStore();
				await blocksStore.fetchBlocks();
			} catch (error) {
				throw error;
			}
		},

		async fetchUser() {
			if (!this.token) return; // Si no hay token, no hacer la petición
			// Mostramos la pantalla de carga
			this.loader.showLoading('Obteniendo información del usuario autenticado');
			try {
				const response = await axios.get(
					import.meta.env.VITE_SIRC_API_URI + 'user',
					{
						headers: { Authorization: `Bearer ${this.token}` },
					}
				);

				this.user = response.data;
				this.entities = response.data.entities;

				// Ocultamos la pantalla de carga
				this.loader.hideLoading();
			} catch (error) {
				if (error instanceof AxiosError) {
					console.error(
						'No autenticado:',
						error?.response?.data || error.message
					);

					// Ocultamos la pantalla de carga
					this.loader.hideLoading();

					await this.logout();
				} else {
					console.error('No autenticado:', error);
				}
			}
		},

		async logout() {
			try {
				// Opcional: Hacer una petición a la API para cerrar sesión en el backend
				await axios.post(
					import.meta.env.VITE_SIRC_API_URI + 'logout',
					{},
					{ headers: { Authorization: `Bearer ${this.token}` } }
				);
			} catch (error) {
				console.error('Error al cerrar sesión en el backend', error);
			}

			// Eliminar el token y los datos del usuario
			localStorage.removeItem('token');
			this.token = null;
			this.user = null;
			delete axios.defaults.headers.common['Authorization'];

			// Redirigir al usuario a la pantalla de login
			await this.route.push('/login');
		},
	},
});
