<script lang="ts" setup>
import {Button} from '@/components/ui/button'
import {IconExchange, IconPencil, IconUpload} from '@tabler/icons-vue'
import {defineEmits, defineProps, ref} from "vue";
import UploadModal from "@/components/Details/UploadModal.vue";

const props = defineProps<{
  registration: {
    id: string,
    uuid: string,
  }
}>()

const openModal = ref(false);

// Función para abrir el modal y enviar `registration`
const openUploadModal = () => {
  openModal.value = true;
};

</script>

<template>
  <div class="space-x-2.5">
    <Button @click="openUploadModal">
      <IconUpload/>
      Cargar
    </Button>
    <Button>
      <IconExchange/>
      Sustituír
    </Button>
    <Button @click="message(registration.id)">
      <IconPencil/>
      Editar
    </Button>
  </div>
  <UploadModal v-model:open="openModal" :registration="registration"/>
</template>

<style scoped>

</style>