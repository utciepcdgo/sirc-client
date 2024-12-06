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
          <NavigationMenuTrigger>Registro</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <li v-for="component in components" :key="component.id">
                <NavigationMenuLink as-child>
                  <a
                      :href="component.href"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div class="text-sm font-medium leading-none">{{ component.title }}</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ component.description }}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <RouterLink to="/" :class="navigationMenuTriggerStyle()">
            <IconHome/>
            <span class="mx-2">Inicio</span>
          </RouterLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </div>
  </NavigationMenu>

  <div class="px-4 w-full lg:px-8">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/registrations">Registrations</RouterLink>
    </nav>

    <main>
      <RouterView/>
    </main>
  </div>

</template>
