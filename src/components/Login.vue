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
    <img alt="IEPC Durango" class="mb-5" src="@/assets/LOGO.png" width="200"/>
    <form class="bg-white p-6 rounded-md shadow-md border border-gray-200" @submit.prevent="login">
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="email">
            Correo electrónico
          </Label>
          <Input id="email" v-model="email" class="col-span-3" type="email"/>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="username">
            Contraseña
          </Label>
          <Input id="username" v-model="password" class="col-span-3" type="password"/>
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
