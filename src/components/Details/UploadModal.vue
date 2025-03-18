<script lang="ts" setup>
import { DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogRoot } from 'radix-vue';
import { defineProps, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { useLoadingStore } from '@/stores/loading';
import FilePondUploader from '@/components/Details/FilePondUploader.vue';
import DataTableUploadedFiles from '@/components/Details/DataTableUploadedFiles.vue';
import { File, Filetype, Registration } from '@/types/types';

const props = defineProps<{
  registration?: Registration;
  opened?: Boolean;
}>();

const fileTypes = ref<Filetype[]>([]);
const uploadedFiles = ref<File[]>([]);

const fetchFileTypes = async () => {
  useLoadingStore().showLoading('Obteniendo información necesaria...');
  try {
    const response = await axios.get(import.meta.env.VITE_SIRC_API_URI + 'filetypes');
    fileTypes.value = response?.data?.data;
    console.log('Tipos de archivos:', fileTypes.value);
  } catch (error) {
    console.error('Error obteniendo los tipos de archivos:', error);
  } finally {
    useLoadingStore().hideLoading();
  }
};

const fetchUploadedFiles = async () => {
  useLoadingStore().showLoading('Obteniendo documentación cargada...');
  try {
    const response = await axios.get(
      import.meta.env.VITE_SIRC_API_URI + 'files?registration_id=' + props.registration?.id,
    );
    uploadedFiles.value = response.data.files;
    console.log('uploadedFiles: ', uploadedFiles);
  } catch (error) {
    console.error('Error obteniendo los archivos cargados:', error);
  } finally {
    useLoadingStore().hideLoading();
  }
};

onMounted(() => {
  fetchFileTypes();
  console.log('Registration from UploadModal ', props.registration);
});

watch(
  () => props.opened,
  (newVal) => {
    if (newVal) {
      // Solo se ejecuta cuando el modal se abre (open === true)
      fetchUploadedFiles();
    }
  },
);

const isFileUploaded = (file: Filetype) => {
  // Compara el id del tipo de archivo con el filetype_id de los archivos cargados.
  return uploadedFiles.value.some((uploaded) => uploaded.filetype.id === file.id);
};

/**
 * Función que determina si el documento está permitido para el registro actual.
 * - Si allowed_to es un array y contiene "all", se permite.
 * - Si es un objeto, se verifica cada condición definida.
 */
function isAllowed(doc: Filetype) {
  // Caso 1: Si allowed_to es un array, se permite si incluye "all".
  if (Array.isArray(doc.allowed_to)) {
    return doc.allowed_to.includes('all');
  }
  // Caso 2: Si allowed_to es un objeto, validar las condiciones
  if (doc.allowed_to && typeof doc.allowed_to === 'object') {
    let matches = true;
    if (doc?.allowed_to?.compensatory_id !== undefined) {
      console.log('Doc: ', doc);
      matches =
        matches && props?.registration?.compensatory.id.toString() === doc?.allowed_to?.compensatory_id.toString();
    }

    if (doc?.allowed_to?.reelection !== undefined) {
      matches = matches && props?.registration?.reelection === doc?.allowed_to?.reelection;
    }

    if (doc?.allowed_to?.sex !== undefined) {
      matches = matches && props?.registration?.sex.id === doc?.allowed_to?.sex;
    }

    // Fotografía
    if (doc.allowed_to?.postulation_id !== undefined && doc.allowed_to?.position_id !== undefined) {
      matches =
        matches &&
        String(props?.registration?.postulation.id) === String(doc?.allowed_to?.postulation_id) &&
        String(props?.registration?.position.id) === String(doc?.allowed_to?.position_id);
    }

    return matches;
  }

  // Por defecto, no se permite
  return false;
}
</script>

<template>
  <DialogRoot>
    <DialogScrollContent class="min-w-[80%]">
      <DialogHeader>
        <DialogTitle>Carga de documentación</DialogTitle>
        <small v-if="props.registration">
          {{ props.registration.name }}
          {{ props.registration.first_name }}
          {{ props.registration.second_name }}
        </small>
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
              <div v-for="file in fileTypes" :key="file?.id">
                <div v-if="isAllowed(file)">
                  <FilePondUploader
                    :disabled="isFileUploaded(file)"
                    :document="file"
                    :is-loaded="isFileUploaded(file)"
                    :registration="registration"
                    @fileUploaded="fetchUploadedFiles" />
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500">Cargando tipos de archivos...</div>
        </TabsContent>
        <TabsContent value="uploaded-files">
          <DataTableUploadedFiles :files="uploadedFiles" :formats="fileTypes" @fileDeleted="fetchUploadedFiles" />
        </TabsContent>
      </Tabs>
    </DialogScrollContent>
  </DialogRoot>
</template>

<style scoped></style>
