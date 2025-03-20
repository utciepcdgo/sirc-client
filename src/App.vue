<script lang="ts" setup>
import Navbar from '@/components/ui/Navbar.vue';
import { useLoadingStore } from '@/stores/loading';
import LoadingScreen from '@/components/ui/LoadingScreen.vue';
import { ref } from 'vue';

const loadingStore = useLoadingStore();

const version = ref(import.meta.env.VITE_VERSION);
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  @apply transition-transform duration-500;
}
.slide-enter-from {
  @apply translate-x-full;
}
.slide-leave-to {
  @apply -translate-x-full;
}

.texture {
  width: 100%;
  height: 100%;
  /* Add your background pattern here */
  backdrop-filter: opacity(100);
  background: rgba(29, 31, 32, 0.904) radial-gradient(rgba(255, 255, 255, 0.092) 10%, transparent 1%);

  background-size: 11px 11px;
}
</style>

<template>
  <Navbar />

  <main>
    <transition name="slide" mode="out-in">
      <RouterView :isLoading="loadingStore.isLoading" />
    </transition>
    <!--  SHOW ALERT LOADING FEED -->
    <LoadingScreen :show="loadingStore.isLoading" :loadingText="loadingStore.loadingText" />
  </main>

  <footer class="bg-gray-50 dark:bg-gray-950 w-full shadow-inner flex flex-col items-center justify-center py-3">
    <div class="mb-5 flex items-center space-x-10">
      <img alt="IEPC Durango Logo" src="@/assets/LOGO.png" class="dark:invert" style="width: 100px" />
      <img alt="IEPC Durango Logo" src="@/assets/Logo_PEL_2025.png" style="width: 40px" />
    </div>
    <p class="text-muted-foreground text-md">
      Software desarrollado por la Unidad Técnica de Cómputo del Instituto Electoral y de Participación Ciudadana del
      Estado de Durango &mdash; {{ new Date().getFullYear() - 1 }} - {{ new Date().getFullYear() }}
    </p>
    <p class="text-xs">
      Si experimenta alguna falla o desea reportar un error, por favor comuníquese a través de los correos electrónicos
      <a class="underline" href="mailto:st@iepcdurango.mx">st@iepcdurango.mx</a>
      o
      <a class="underline" href="mailto:ut.computo@iepcdurango.mx">ut.computo@iepcdurango.mx</a>
    </p>
    <div class="flex space-x-3.5 text-xs">
      <a href="https://iepcdurango.mx" target="_blank">Página oficial del IEPC</a>
      <span>|</span>
      <a
        href="https://www.iepcdurango.mx/IEPC_DURANGO/documentos/2021/avisos_privacidad/mod_15_feb_2021/TECNICA/FORMATO%20AVISO%20PRIVACIDAD%20REGISTRO%20DE%20CANDIDATOS.pdf"
        target="_blank">
        Aviso de privacidad
      </a>
    </div>
    <small class="text-muted-foreground">Versión {{ version }}</small>
  </footer>
</template>
