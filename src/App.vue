<script lang="ts" setup>
import {NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle,} from '@/components/ui/navigation-menu'

import {RegistrationRoutes} from "@/lib/utils"
import {useAuthStore} from "@/stores/auth";
import {AlertDialog, AlertDialogContent, AlertDialogTitle} from "@/components/ui/alert-dialog";
import Navbar from "@/components/ui/Navbar.vue";
import {VisuallyHidden} from "radix-vue";
import {FingerprintSpinner} from "epic-spinners";
import {useLoadingStore} from "@/stores/loading";

const components = RegistrationRoutes
const loadingStore = useLoadingStore();

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

  <Navbar/>

  <div>
    <main>
      <RouterView :isLoading="isLoading"/>
    </main>
  </div>

</template>
