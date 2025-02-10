<script lang="ts" setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {useLoadingStore} from "@/stores/loading";
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {IconEye, IconEyeClosed} from '@tabler/icons-vue';


const email = ref("coordinacion.electoralpv@gmail.com");
const password = ref("secret");
const errorMessage = ref(null);
const showPassword = ref(false);

const isLoading = useLoadingStore();
const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
  isLoading.showLoading();
  await authStore.login({email: email.value, password: password.value})
      .catch((error) => {
        errorMessage.value = error.response.data.message;
        console.log("Erroooor: ", error.response.request)
      })
      .finally(() => {
        isLoading.hideLoading();
      })
  // Redirect to /registrations
  if (authStore.token) {
    await router.push("/registrations");
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
    <img src="@/assets/LOGO.png" alt="IEPC Durango Logo" class="w-64 md:w-1/12 mb-10"/>
    <Card class="w-full max-w-sm shadow-lg border dark:border-gray-800">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl font-semibold">Iniciar Sesión</CardTitle>
      </CardHeader>

      <CardContent>
        <!-- Alert de Error -->
        <Alert v-if="errorMessage" class="mb-4" variant="destructive">
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>

        <!-- Campo de Email -->
        <div class="mb-4">
          <Label for="email">Correo Electrónico</Label>
          <Input id="email" v-model="email" placeholder="usuario@correo.com" required type="email"/>
        </div>

        <!-- Campo de Contraseña -->
        <div class="mb-4 relative">
          <Label for="password">Contraseña</Label>
          <div class="relative">
            <Input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="********" required/>
            <button class="absolute right-3 top-3 text-gray-500 dark:text-gray-400" type="button" @click="showPassword = !showPassword">
              <IconEye v-if="!showPassword" class="w-5 h-5"/>
              <IconEyeClosed v-else class="w-5 h-5"/>
            </button>
          </div>
        </div>

        <!-- Botón de Login -->
        <Button :disabled="isLoading.isLoading" class="w-full mt-2" @click="login">
          <span v-if="isLoading.isLoading">Cargando...</span>
          <span v-else>Ingresar</span>
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
<style scoped>

</style>
