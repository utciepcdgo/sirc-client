<script lang="ts" setup>
import {DialogHeader, DialogScrollContent, DialogTitle} from '@/components/ui/dialog'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {DialogRoot} from "radix-vue";
import {defineProps, onMounted, ref, watch, defineEmits} from "vue";
import axios from "axios";
import {useLoadingStore} from "@/stores/loading";
import FilePondUploader from "@/components/Details/FilePondUploader.vue";
import DataTableUploadedFiles from "@/components/Details/DataTableUploadedFiles.vue";


const props = defineProps({
  registration: Object, // Recibe el objeto desde el padre
  opened: {
    type: Boolean,
    default: false,
  },
});


const fileTypes = ref([]);
const uploadedFiles = ref([]);

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

const fetchUploadedFiles = async () => {
  useLoadingStore().showLoading();
  try {
    const response = await axios.get(import.meta.env.VITE_SIRC_API_URI + 'files?registration_id=' + props.registration.id);
    uploadedFiles.value = response.data.files;
    console.log("uploadedFiles: ", uploadedFiles)
  } catch (error) {
    console.error("Error obteniendo los archivos cargados:", error);
  } finally {
    useLoadingStore().hideLoading();
  }
};

onMounted(() => {
  fetchFileTypes()
});

watch(
    () => props.opened,
    (newVal) => {
      if (newVal) {
        // Solo se ejecuta cuando el modal se abre (open === true)
        fetchUploadedFiles();
      }
    }
);

const isFileUploaded = (file) => {
  // Compara el id del tipo de archivo con el filetype_id de los archivos cargados.
  return uploadedFiles.value.some(uploaded => uploaded.filetype.id === file.id);
};

</script>

<template>
  <DialogRoot>
    <DialogScrollContent class="min-w-[80%]">
      <DialogHeader>
        <DialogTitle>Carga de documentación</DialogTitle>
        <small v-if="props.registration">{{ props.registration.name }} {{ props.registration.first_name }} {{ props.registration.second_name }}</small>
        <small v-else>Cargando...</small>
      </DialogHeader>
      <!--      Colocamos Tabs para dividir la sección de carga y la sección de "Gestión de archivos cargados"-->
      <Tabs default-value="upload-files">
        <TabsList>
          <TabsTrigger value="upload-files">Cargar Documentación</TabsTrigger>
          <TabsTrigger value="uploaded-files">Documentación registrada</TabsTrigger>
        </TabsList>
        <TabsContent value="upload-files">
          <div v-if="fileTypes.length">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-end gap-4">
              <div v-for="file in fileTypes" :key="file.id">
                <FilePondUploader :disabled="isFileUploaded(file)" :document="file" :is-loaded="isFileUploaded(file)" :registration="registration" @fileUploaded="fetchUploadedFiles"/>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500">Cargando tipos de archivos...</div>
        </TabsContent>
        <TabsContent value="uploaded-files">
          <DataTableUploadedFiles :files="uploadedFiles" :formats="fileTypes" @fileDeleted="fetchUploadedFiles"/>
        </TabsContent>
      </Tabs>
    </DialogScrollContent>
  </DialogRoot>
</template>

<style scoped>

</style>