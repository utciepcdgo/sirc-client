<!--suppress ALL -->
<script setup lang="ts">

import {NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle} from "@/components/ui/navigation-menu";
import {Button} from "@/components/ui/button";
import {IconHome, IconRefresh} from "@tabler/icons-vue";
import {useLoadingStore} from '@/stores/loading';
import {useAuthStore} from "@/stores/auth";
import {useBlocksStore} from "@/stores/blocks";

const authStore = useAuthStore();
const loadingStore = useLoadingStore();
const store = useBlocksStore()

const handleLogout = async () => {
  loadingStore.showLoading()
  await authStore.logout().finally(() => {
    loadingStore.hideLoading()
  });
};
</script>

<template>
  <NavigationMenu v-if="authStore.user" class="w-full">
    <div class="px-4 mx-auto w-full sm:px-6 lg:px-8">
      <NavigationMenuList class="w-full">
        <div class="flex items-center space-x-3 justify-between h-16 w-full">
          <div class="w-100">
            <NavigationMenuItem>
              <RouterLink :class="navigationMenuTriggerStyle()" to="/registrations">
                <IconHome/>
                <span class="mx-2">Inicio</span>
              </RouterLink>
            </NavigationMenuItem>
          </div>
          <div>
            <!--            Logo-->
            <img alt="IEPC Durango Logo" class="mb-5" src="@/assets/LOGO.png" width="100"/>
          </div>
          <div class="w-100 flex space-x-3 justify-end">
            <NavigationMenuItem>
              <Button variant="ghost" @click="store.fetchBlocks()">
                <IconRefresh class="h-4 w-4"/>
              </Button>
            </NavigationMenuItem>
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
</template>

<style scoped>

</style>