<script lang="ts" setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'

const email = ref("coordinacion.electoralpv@gmail.com");
const password = ref("secret");
const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
  await authStore.login({email: email.value, password: password.value});
  // Redirect to /registrations
  if (authStore.token) {
    await router.push("/registrations");
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <!--    Logo IEPC Durango-->
    <img alt="IEPC Durango Logo" class="mb-5" src="@/assets/LOGO.png" width="200"/>
    <form class="bg-white p-6 rounded-md shadow-md border border-gray-200" @submit.prevent="login">
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="email">
            Correo electrónico
          </Label>
          <input id="email" v-model="email" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" type="email"/>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="username">
            Contraseña
          </Label>
          <input id="username" v-model="password" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" type="password"/>
        </div>
      </div>
      <div class="flex items-center justify-end">
        <Button type="submit">Iniciar sesión</Button>
      </div>
    </form>
  </div>
</template>
<style scoped>

</style>
