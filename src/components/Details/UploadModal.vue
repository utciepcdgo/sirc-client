<script lang="ts" setup>
import {DialogHeader, DialogScrollContent, DialogTitle} from '@/components/ui/dialog'
import {DialogRoot} from "radix-vue";
import {defineProps, onMounted, ref} from "vue";
import axios from "axios";
import {useLoadingStore} from "@/stores/loading";
import FilePondUploader from "@/components/Details/FilePondUploader.vue";


const props = defineProps({
  registration: Object, // Recibe el objeto desde el padre
});

const fileTypes = ref([]);

const fetchFileTypes = async () => {
  useLoadingStore().showLoading();
  try {
    const response = await axios.get(import.meta.env.VITE_SIRC_API_URI + 'filetypes');
    fileTypes.value = response.data.data;
    console.log("Tipos de archivos:", fileTypes.value);
  } catch (error) {
    console.error("Error obteniendo los tipos de archivos:", error);
  } finally {
    useLoadingStore().hideLoading();
  }
};

onMounted(fetchFileTypes);

</script>

<template>
  <DialogRoot>
    <DialogScrollContent class="min-w-[80%]">
      <DialogHeader>
        <DialogTitle>Detalles del Registro</DialogTitle>
      </DialogHeader>

      <div v-if="props.registration">
        <p><strong>Nombre:</strong> {{ props.registration.name }}</p>
        <p><strong>Primer Apellido:</strong> {{ props.registration.first_name }}</p>
        <p><strong>Segundo Apellido:</strong> {{ props.registration.second_name }}</p>
      </div>
      <p v-else>Cargando...</p>

      <div v-if="fileTypes.length">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-end gap-4">
          <div v-for="file in fileTypes" :key="file.id">
            <FilePondUploader :document="file" :registration="registration" :disabled="true" />
          </div>
        </div>
      </div>

      <div v-else class="text-gray-500">Cargando tipos de archivos...</div>
    </DialogScrollContent>
  </DialogRoot>
</template>

<style scoped>

</style>