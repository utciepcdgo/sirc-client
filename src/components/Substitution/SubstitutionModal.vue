<script lang="ts" setup>
import { DialogFooter, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import { DialogRoot } from 'radix-vue';
import { Button } from '@/components/ui/button';
import Form from '@/components/Substitution/Form.vue';
import { Registration } from '@/types/types';
import { ref } from 'vue';

defineProps<{
  registration: Registration | null;
}>();

const emit = defineEmits(['closeSubstitutionModal']);

const isModalOpen = ref<boolean>(false);

const closeModal = () => {
  isModalOpen.value = false;
  emit('closeSubstitutionModal');
};
</script>

<template>
  <DialogRoot :open="isModalOpen" @update:open="(value) => (isModalOpen = value)">
    <DialogScrollContent class="min-w-[80%]">
      <DialogHeader>
        <DialogTitle>Sustituir registro en {{ registration.block.municipality.name }}</DialogTitle>
        <small>{{ registration.name }} {{ registration.first_name }} {{ registration.second_name }}</small>
      </DialogHeader>
      <Form :registration="registration" @closeSubstitutionModal="closeModal" />
      <DialogFooter>
        <Button form="substitution_form" type="submit">Sustituir registro</Button>
        <Button variant="destructive" @click="$emit('closeSubstitutionModal')">Cerrar</Button>
      </DialogFooter>
    </DialogScrollContent>
  </DialogRoot>
</template>

<style scoped></style>
