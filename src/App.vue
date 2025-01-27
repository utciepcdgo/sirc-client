<script setup lang="ts">
import {Button} from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import {RegistrationRoutes} from "@/lib/utils"
import {IconHome} from '@tabler/icons-vue';

const components = RegistrationRoutes

</script>

<style scoped>
</style>

<template>
  <NavigationMenu>
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <NavigationMenuList>
        <NavigationMenuItem>
          <RouterLink to="/registrations" :class="navigationMenuTriggerStyle()">
            <IconHome/>
            <span class="mx-2">Inicio</span>
          </RouterLink>
        </NavigationMenuItem>
<!--        OPEN DIALOG MODAL FOR GENERATE A LATEST-->
        <NavigationMenuItem>

        </NavigationMenuItem>
      </NavigationMenuList>
    </div>
  </NavigationMenu>

  <div class="px-4 w-full lg:px-8 mt-5">
    <main>
      <RouterView/>
    </main>
  </div>

</template>
