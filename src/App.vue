<script lang="ts" setup>
import {RegistrationRoutes} from "@/lib/utils"
import Navbar from "@/components/ui/Navbar.vue";
import {useLoadingStore} from "@/stores/loading";
import LoadingScreen from "@/components/ui/LoadingScreen.vue";

const components = RegistrationRoutes
const loadingStore = useLoadingStore();

</script>

<style scoped>

</style>

<template>

  <Navbar/>


    <main>

      <RouterView :isLoading="loadingStore.isLoading"/>
      <!--  SHOW ALERT LOADING FEED -->
      <LoadingScreen :show="loadingStore.isLoading"/>

    </main>

</template>
