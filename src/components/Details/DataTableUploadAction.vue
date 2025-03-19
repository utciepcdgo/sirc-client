<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { IconExchange, IconPencil, IconUpload } from '@tabler/icons-vue';
import { defineProps, ref } from 'vue';
import UploadModal from '@/components/Details/UploadModal.vue';
import EditionModal from '@/components/Edition/EditionModal.vue';
import SubstitutionModal from '@/components/Substitution/SubstitutionModal.vue';
import { Registration } from '@/types/types';

defineProps<{
  registration: Registration;
}>();

const openModal = ref<boolean>(false);
const openEditionModal = ref<boolean>(false);
const openedSubstitutionModal = ref<boolean>(false);

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
  <div class="space-x-0 sm:space-y-1 2xl:space-x-2.5">
    <Button @click="openUploadModal">
      <IconUpload />
      Cargar
    </Button>
    <Button @click="openSubstitutionModal">
      <IconExchange />
      Sustituír
    </Button>
    <Button @click="openEditModal">
      <IconPencil />
      Editar
    </Button>
  </div>
  <UploadModal v-model:open="openModal" :opened="openModal" :registration="<Registration>registration" />
  <EditionModal
    v-model:open="openEditionModal"
    @closeEditionModal="closeEditionModal"
    :registration="<Registration>registration" />
  <SubstitutionModal
    v-model:open="openedSubstitutionModal"
    :registration="registration"
    @closeSubstitutionModal="closeSubstitutionModal" />
</template>

<style scoped></style>
