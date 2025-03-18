<script lang="ts" setup>
import { DialogFooter, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import { DialogRoot } from 'radix-vue';
import { Button } from '@/components/ui/button';
import Form from '@/components/Edition/Form.vue';
import { defineProps, ref } from 'vue';
import { Registration } from '@/types/types';

defineProps<{
  registration?: Registration;
}>();

const emit = defineEmits(['closeEditionModal']);

const isModalOpen = ref<boolean>(false);

const closeModal = () => {
  isModalOpen.value = false;
  emit('closeEditionModal');
};
</script>

<template>
  <DialogRoot :open="isModalOpen" @update:open="(value) => (isModalOpen = value)">
    <DialogScrollContent class="min-w-[80%]">
      <DialogHeader>
        <DialogTitle>Editar registro</DialogTitle>
        <small>
          {{ registration.name }} {{ registration.first_name }} {{ registration.second_name }} ·
          {{ registration.postulation.name.toUpperCase() }} ·
          {{ registration.block.municipality.name.toUpperCase() }}
        </small>
      </DialogHeader>
      <Form :registration="registration" @closeEditionModal="closeModal" />
      <DialogFooter>
        <Button form="edition_form" type="submit">Guardar registro</Button>
        <Button variant="destructive" @click="$emit('closeEditionModal')">Cancelar</Button>
      </DialogFooter>
    </DialogScrollContent>
  </DialogRoot>
</template>

<style scoped></style>
