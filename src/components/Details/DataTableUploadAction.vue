<script lang="ts" setup>
import {Button} from '@/components/ui/button'
import {IconExchange, IconPencil, IconUpload} from '@tabler/icons-vue'
import {defineEmits, defineProps, ref} from "vue";
import UploadModal from "@/components/Details/UploadModal.vue";
import EditionModal from "@/components/Edition/EditionModal.vue";
import SubstitutionModal from "@/components/Substitution/SubstitutionModal.vue";

const props = defineProps<{
  registration: {
    id: string,
    uuid: string,
  }
}>()

const openModal = ref(false);
const openEditionModal = ref(false);
const openedSubstitutionModal = ref(false);

// Función para abrir el modal y enviar `registration`
const openUploadModal = () => {
  openModal.value = true;
};

const openEditModal = () => {
  openEditionModal.value = true;
};

const closeEditionModal = () => {
  openEditionModal.value = false;
};

const openSubstitutionModal = () => {
  openedSubstitutionModal.value = true;
};

const closeSubstitutionModal = () => {
  openedSubstitutionModal.value = false;
};

</script>

<template>
  <div class="space-x-2.5">
    <Button @click="openUploadModal">
      <IconUpload/>
      Cargar
    </Button>
    <Button @click="openSubstitutionModal">
      <IconExchange/>
      Sustituír
    </Button>
    <Button @click="openEditModal">
      <IconPencil/>
      Editar
    </Button>
  </div>
  <UploadModal v-model:open="openModal" :registration="registration" :opened="openModal"/>
  <EditionModal :registration="registration" v-model:open="openEditionModal" @close-edition-modal="closeEditionModal"/>
  <SubstitutionModal :registration="registration" v-model:open="openedSubstitutionModal" @close-edition-modal="closeSubstitutionModal"/>
</template>

<style scoped>

</style>