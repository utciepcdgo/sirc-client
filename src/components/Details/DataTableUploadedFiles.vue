<script lang="ts" setup>

import axios from 'axios';
import {Button} from '@/components/ui/button'
import {IconDownload, IconLoader2, IconTrash} from "@tabler/icons-vue";
import {useLoadingStore} from "@/stores/loading";
import {useToast} from '@/components/ui/toast';
import {defineEmits, ref} from "vue";


const emit = defineEmits(['fileDeleted']);

const {toast} = useToast();
const loading = useLoadingStore();

const isDownloading = ref(false);

const props = defineProps<{
  files: {
    required: true,
    type: Object,
  },
  formats: Object
}>()

async function deleteFormat(id: string) {
  try {
    loading.showLoading();
    await axios.delete(import.meta.env.VITE_SIRC_API_URI + `file/${id}`);
    toast({
      title: 'Archivo eliminado correctamente',
      variant: 'default',
    });
    emit('fileDeleted');
    loading.hideLoading();
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    toast({
      title: 'Error al eliminar el archivo',
      variant: 'destructive',
    });
    loading.hideLoading();
  }
}

const downloadFile = async (fileId) => {
  try {
    isDownloading.value = true;
    // Solicitar el enlace a la API
    const {data} = await axios.get(import.meta.env.VITE_SIRC_API_URI + `request-download/${fileId}`);

    if (data.success && data.url) {
      // Opción 1: Redireccionar la ventana actual
      // window.location.href = data.url;

      // Opción 2: Abrir en una nueva pestaña (descomentar si se prefiere)
      window.open(data.url, '_blank');
    }
  } catch (error) {
    console.error('Error al obtener el enlace temporal:', error);

    toast({
      title: 'Error en la solicitud de descarga',
      variant: 'destructive',
    });

    isDownloading.value = false;
    // Aquí puedes agregar lógica para mostrar una alerta al usuario
  } finally {
    isDownloading.value = false;
  }
};

</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-2">Archivos cargados</h2>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
        <tr>
          <th class="text-left">Formato</th>
          <th class="text-left">Formato del archivo</th>
          <th class="text-left">Fecha de carga</th>
          <th class="text-left"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="file in files" :key="file.id">
          <td>{{ file.filetype.name }}</td>
          <td>{{ file.format }}</td>
          <td>{{ file.created_at }}</td>
          <td>
            <Button class="text-red-400" variant="ghost" @click="deleteFormat(file.id)">
              <IconTrash/>
              Eliminar
            </Button>

            <Button :disabled="isDownloading" variant="link" @click="downloadFile(file.id)">
              <IconDownload v-show="!isDownloading"/>
              <IconLoader2 class="animate-spin" v-show="isDownloading"/>
              {{ isDownloading ? 'Solicitando enlace...' : 'Descargar' }}
            </Button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>