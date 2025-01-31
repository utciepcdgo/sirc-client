<script lang="ts" setup>
import {NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle,} from '@/components/ui/navigation-menu'

import {RegistrationRoutes} from "@/lib/utils"
import {IconHome} from '@tabler/icons-vue';
import {useAuthStore} from "@/stores/auth";
import {Button} from "@/components/ui/button";
import {ref} from "vue";
import {AlertDialog, AlertDialogContent, AlertDialogTitle} from "@/components/ui/alert-dialog";
import {VisuallyHidden} from "radix-vue";
import {FingerprintSpinner} from "epic-spinners";
import { useLoadingStore } from '@/stores/loading';

const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const handleLogout = async () => {
  loadingStore.showLoading()
  await authStore.logout().finally(() => {
    loadingStore.hideLoading()
  });
};

const components = RegistrationRoutes

</script>

<style scoped>
</style>

<template>
  <!--  SHOW ALERT LOADING FEED -->
  <AlertDialog v-model:open="loadingStore.isLoading">
    <AlertDialogContent class="w-[177.6px] bg-transparent border-0 shadow-none">
      <VisuallyHidden>
        <AlertDialogTitle>Cargando...</AlertDialogTitle>
      </VisuallyHidden>
      <FingerprintSpinner :animation-duration="1500" :color="'#ffffff'" :size="128"/>
      <p class="text-center font-bold text-white">Cargando...</p>
    </AlertDialogContent>
  </AlertDialog>


  <NavigationMenu v-if="authStore.user">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <NavigationMenuList>
        <div class="flex items-center justify-between h-16">
          <div>
            <NavigationMenuItem>
              <RouterLink :class="navigationMenuTriggerStyle()" to="/registrations">
                <IconHome/>
                <span class="mx-2">Inicio</span>
              </RouterLink>
            </NavigationMenuItem>
          </div>
          <div>
            <NavigationMenuItem>
              <Button variant="secondary" @click="handleLogout">
                Cerrar sesión
              </Button>
            </NavigationMenuItem>
          </div>
        </div>
      </NavigationMenuList>
    </div>
  </NavigationMenu>
  <nav class="bg-gray-300">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">

          <button aria-controls="mobile-menu" aria-expanded="false" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset" type="button">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>

            <svg aria-hidden="true" class="block size-6" data-slot="icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <svg aria-hidden="true" class="hidden size-6" data-slot="icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center">
            <img alt="Your Company" class="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500">
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <RouterLink class="flex items-center space-x-2.5 rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                          to="/registrations">
                <IconHome/>
                <span>Inicio</span>
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" type="button">
            <span class="absolute -inset-1.5"></span>
            <span class="sr-only">View notifications</span>
            <svg aria-hidden="true" class="size-6" data-slot="icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <Button variant="default" @click="handleLogout">
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div id="mobile-menu" class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <a aria-current="page" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" href="#">Dashboard</a>
        <a class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" href="#">Team</a>
        <a class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" href="#">Projects</a>
        <a class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" href="#">Calendar</a>
      </div>
    </div>
  </nav>

  <div class="px-4 w-full lg:px-8 mt-5">
    <main>
      <RouterView :isLoading="isLoading"/>
    </main>
  </div>

</template>
