<script lang="ts" setup>

import {DialogFooter, DialogHeader, DialogScrollContent, DialogTitle} from "@/components/ui/dialog";
import {DialogRoot} from "radix-vue";
import {Button} from "@/components/ui/button";
import Form from "@/components/Substitution/Form.vue";

const props = defineProps({
  registration: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['closeEditionModal']);

</script>

<template>
  <DialogRoot>
    <DialogScrollContent class="min-w-[80%]">
      <DialogHeader>
        <DialogTitle>Sustituir registro en {{ registration.block.municipality.name }}</DialogTitle>
        <small>{{ registration.name }} {{ registration.first_name }} {{ registration.second_name }}</small>
      </DialogHeader>
      <Form :registration="registration"/>
      <DialogFooter>
        <Button form="substitution_form" type="submit">
          Sustituir registro
        </Button>
        <Button variant="destructive" @click="$emit('closeEditionModal')">
          Cerrar
        </Button>
      </DialogFooter>
    </DialogScrollContent>
  </DialogRoot>
</template>

<style scoped>

</style>