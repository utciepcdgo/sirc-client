<script setup lang="ts">

import {DialogDescription, DialogFooter, DialogHeader, DialogScrollContent, DialogTitle} from "@/components/ui/dialog";
import {DialogRoot} from "radix-vue";
import {Button} from "@/components/ui/button";
import Form from "@/components/Edition/Form.vue";
import {ref} from "vue";
import FilePondUploader from "@/components/Details/FilePondUploader.vue";

const props = defineProps({
  registration: {
    type: Object,
    required: true
  }
});

const openEditModal = ref(false)
</script>

<template>
  <DialogRoot>
    <DialogScrollContent class="min-w-[80%]">
      <DialogHeader>
        <DialogTitle>Detalles del Registro</DialogTitle>
      </DialogHeader>
      <Form :registration="registration"/>
      <DialogFooter>
        <Button form="edition_form" type="submit">
          Guardar registro
        </Button>
      </DialogFooter>
    </DialogScrollContent>
  </DialogRoot>
</template>

<style scoped>

</style>