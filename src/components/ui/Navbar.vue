<!--suppress ALL -->
<script lang="ts" setup>
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	IconDoorExit,
	IconRefresh,
	IconMoon,
	IconSun,
	IconFile,
} from '@tabler/icons-vue';
import { useLoadingStore } from '@/stores/loading';
import { useAuthStore } from '@/stores/auth';
import { useBlocksStore } from '@/stores/blocks';
import TooltipWrapper from '@/components/ui/TooltipWrapper.vue';
import { useColorMode } from '@vueuse/core';

const authStore = useAuthStore();
const loadingStore = useLoadingStore();
const store = useBlocksStore();

const handleLogout = async () => {
	loadingStore.showLoading('Cerrando su sesión actual...');
	await authStore.logout().finally(() => {
		loadingStore.hideLoading();
	});
};

const openManual = () => {
	window.open(
		'https://s3.us-east-1.amazonaws.com/static.appsiepcdurango.mx/Miselaneo/Manual+de+Usuario+del+SIRC+2024-2025.pdf',
		'_blank'
	);
};

const mode = useColorMode();
</script>

<template>
	<NavigationMenu
		v-if="authStore.user"
		class="w-full shadow bg-slate-50 dark:bg-gray-800">
		<div class="px-4 mx-auto w-full sm:px-6 lg:px-8">
			<NavigationMenuList class="w-full">
				<div
					class="flex items-center space-x-3 justify-between h-16 w-full">
					<div class="w-100">
						<small>Bienvenida/o</small>
						<p>{{ authStore.user.name }}</p>
					</div>
					<div class="flex items-center space-x-3.5">
						<!--            Logo-->
						<img
							alt="IEPC Durango Logo"
							src="@/assets/LOGO.png"
							width="100"
							class="dark:invert" />
						<div class="flex flex-col text-center">
							<span class="font-semibold text-md"
								>INSTITUTO ELECTORAL Y DE PARTICIPACIÓN
								CIUDADANA DEL ESTADO DE DURANGO</span
							>
							<span class="font-semibold text-xs"
								>SISTEMA DE REGISTRO DE CANDIDATURAS</span
							>
						</div>
					</div>
					<div class="w-100 flex space-x-3 justify-end">
						<NavigationMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger as-child>
									<Button variant="ghost">
										<IconMoon
											class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
										<IconSun
											class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
										<span class="sr-only"
											>Alternar colores</span
										>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem @click="mode = 'light'">
										Claro
									</DropdownMenuItem>
									<DropdownMenuItem @click="mode = 'dark'">
										Oscuro
									</DropdownMenuItem>
									<DropdownMenuItem @click="mode = 'auto'">
										Sistema
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<TooltipWrapper message="Actualizar">
								<Button
									variant="ghost"
									@click="store.fetchBlocks()">
									<IconRefresh />
								</Button>
							</TooltipWrapper>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<TooltipWrapper message="Cerrar sesión">
								<Button
									variant="secondary"
									@click="handleLogout">
									<IconDoorExit />
								</Button>
							</TooltipWrapper>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<TooltipWrapper message="Manual de usuario">
								<Button variant="ghost" @click="openManual">
									<IconFile />
								</Button>
							</TooltipWrapper>
						</NavigationMenuItem>
					</div>
				</div>
			</NavigationMenuList>
		</div>
	</NavigationMenu>
</template>

<style scoped></style>
