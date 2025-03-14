<script lang="ts" setup>
import Navbar from '@/components/ui/Navbar.vue';
import { useLoadingStore } from '@/stores/loading';
import LoadingScreen from '@/components/ui/LoadingScreen.vue';

const loadingStore = useLoadingStore();
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
</template>
