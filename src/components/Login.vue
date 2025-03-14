<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconEye, IconEyeClosed } from '@tabler/icons-vue';

const email = ref('coordinacion.electoralpv@gmail.com');
const password = ref('secret');
const errorMessage = ref(null);
const showPassword = ref(false);

const isLoading = useLoadingStore();
const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
	isLoading.showLoading();
	try {
		await authStore.login({ email: email.value, password: password.value });
		// Redirect to /registrations
		if (authStore.token) {
			await router.push('/registrations');
		}
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message || 'Error desconocido';
		console.log('Erroooor: ', error.response?.request || error);
	} finally {
		isLoading.hideLoading();
	}
};
</script>

<template>
	<!--  <div class="animation-container"></div>-->
	<div
		class="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900/50 relative">
		<div class="flex items-center justify-between mb-10 space-x-5 z-10">
			<img
				alt="IEPC Durango Logo"
				class="max-w-48 md:w-1/12 flex-1 dark:invert dark:brightness-100"
				src="@/assets/LOGO.png" />
			<div class="h-20 w-0.5 bg-black dark:bg-gray-600"></div>
			<p class="w-32 text-sm font-bold">
				Sistema de Registro de Candidaturas
			</p>
		</div>
		<Card
			class="w-full max-w-sm shadow-lg border dark:border-gray-800 bg-white/90 dark:bg-gray-800/90 relative z-10">
			<CardHeader class="text-center">
				<CardTitle class="text-2xl font-semibold"
					>Iniciar Sesión</CardTitle
				>
			</CardHeader>

			<CardContent>
				<!-- Alert de Error -->
				<Alert v-if="errorMessage" class="mb-4" variant="destructive">
					<AlertDescription>{{ errorMessage }}</AlertDescription>
				</Alert>

				<!-- Campo de Email -->
				<div class="mb-4">
					<Label for="email">Correo Electrónico</Label>
					<Input
						id="email"
						name="email"
						v-model="email"
						placeholder="usuario@correo.com"
						required
						type="email" />
				</div>

				<!-- Campo de Contraseña -->
				<div class="mb-4 relative">
					<Label for="password">Contraseña</Label>
					<div class="relative">
						<Input
							id="password"
							name="password"
							v-model="password"
							:type="showPassword ? 'text' : 'password'"
							placeholder="********"
							required />
						<button
							class="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
							type="button"
							@click="showPassword = !showPassword">
							<IconEye v-if="!showPassword" class="w-5 h-5" />
							<IconEyeClosed v-else class="w-5 h-5" />
						</button>
					</div>
				</div>

				<!-- Botón de Login -->
				<Button
					:disabled="isLoading.isLoading"
					class="w-full mt-2"
					@click="login">
					<span v-if="isLoading.isLoading">Cargando...</span>
					<span v-else>Ingresar</span>
				</Button>
			</CardContent>
		</Card>
	</div>
</template>
<style scoped>
.animation-container::after {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	inset: 0;
	z-index: 1;
	backdrop-filter: blur(1em) brightness(6);
	background-image: radial-gradient(
		circle at 50% 50%,
		#0000 0,
		#0000 2px,
		hsl(0 0 4%) 2px
	);
	background-size: 8px 8px;
}

.animation-container {
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
	--c: #09f;
	background-color: #000;
	background-image: radial-gradient(4px 100px at 0px 235px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 235px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 117.5px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 252px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 252px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 126px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 150px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 150px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 75px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 253px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 253px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 126.5px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 204px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 204px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 102px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 134px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 134px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 67px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 179px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 179px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 89.5px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 299px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 299px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 149.5px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 215px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 215px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 107.5px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 281px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 281px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 140.5px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 158px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 158px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 79px, var(--c) 100%, #0000 150%),
		radial-gradient(4px 100px at 0px 210px, var(--c), #0000),
		radial-gradient(4px 100px at 300px 210px, var(--c), #0000),
		radial-gradient(1.5px 1.5px at 150px 105px, var(--c) 100%, #0000 150%);
	background-size:
		300px 235px,
		300px 235px,
		300px 235px,
		300px 252px,
		300px 252px,
		300px 252px,
		300px 150px,
		300px 150px,
		300px 150px,
		300px 253px,
		300px 253px,
		300px 253px,
		300px 204px,
		300px 204px,
		300px 204px,
		300px 134px,
		300px 134px,
		300px 134px,
		300px 179px,
		300px 179px,
		300px 179px,
		300px 299px,
		300px 299px,
		300px 299px,
		300px 215px,
		300px 215px,
		300px 215px,
		300px 281px,
		300px 281px,
		300px 281px,
		300px 158px,
		300px 158px,
		300px 158px,
		300px 210px,
		300px 210px,
		300px 210px;
	animation: hi 1000s linear infinite;
}

@keyframes hi {
	0% {
		background-position:
			0px 220px,
			3px 220px,
			151.5px 337.5px,
			25px 24px,
			28px 24px,
			176.5px 150px,
			50px 16px,
			53px 16px,
			201.5px 91px,
			75px 224px,
			78px 224px,
			226.5px 350.5px,
			100px 19px,
			103px 19px,
			251.5px 121px,
			125px 120px,
			128px 120px,
			276.5px 187px,
			150px 31px,
			153px 31px,
			301.5px 120.5px,
			175px 235px,
			178px 235px,
			326.5px 384.5px,
			200px 121px,
			203px 121px,
			351.5px 228.5px,
			225px 224px,
			228px 224px,
			376.5px 364.5px,
			250px 26px,
			253px 26px,
			401.5px 105px,
			275px 75px,
			278px 75px,
			426.5px 180px;
	}

	to {
		background-position:
			0px 6800px,
			3px 6800px,
			151.5px 6917.5px,
			25px 13632px,
			28px 13632px,
			176.5px 13758px,
			50px 5416px,
			53px 5416px,
			201.5px 5491px,
			75px 17175px,
			78px 17175px,
			226.5px 17301.5px,
			100px 5119px,
			103px 5119px,
			251.5px 5221px,
			125px 8428px,
			128px 8428px,
			276.5px 8495px,
			150px 9876px,
			153px 9876px,
			301.5px 9965.5px,
			175px 13391px,
			178px 13391px,
			326.5px 13540.5px,
			200px 14741px,
			203px 14741px,
			351.5px 14848.5px,
			225px 18770px,
			228px 18770px,
			376.5px 18910.5px,
			250px 5082px,
			253px 5082px,
			401.5px 5161px,
			275px 6375px,
			278px 6375px,
			426.5px 6480px;
	}
}
</style>
