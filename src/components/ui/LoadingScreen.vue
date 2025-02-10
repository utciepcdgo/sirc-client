<script lang="ts" setup>
import {FingerprintSpinner} from "epic-spinners";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  }
});

</script>

<template>
  <div v-if="show" class="loading-overlay">
    <div class="loading-content">
      <FingerprintSpinner :animation-duration="1500" :color="'#ffffff'" :size="128"/>
      <p class="text-white font-bold">Cargando...</p>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}
</style>