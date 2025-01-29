<script lang="ts" setup>
import {Button} from '@/components/ui/button'
import {IconExchange, IconPencil, IconUpload} from '@tabler/icons-vue'
import {DialogFooter, DialogHeader, DialogScrollContent, DialogTitle,} from '@/components/ui/dialog'
import {DialogRoot} from "radix-vue";
import {ref} from "vue";

defineProps<{
  registration: {
    id: string,
    uuid: string,
  }
}>()

function message(id: string) {
  alert(id)
}

let openUploadModal = ref(false)

</script>

<template>
  <div class="space-x-2.5">
    <Button @click="openUploadModal = true">
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

  <!--  Modal for upload files-->
  <DialogRoot v-model:open="openUploadModal">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cargar archivo</DialogTitle>
        <DialogClose/>
      </DialogHeader>
      <DialogScrollContent>
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-700" for="file">Archivo</label>
            <input id="file" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="file" type="file">
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm font-medium text-gray-700" for="description">Descripción</label>
            <textarea id="description" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="description" rows="3"></textarea>
          </div>
        </div>
      </DialogScrollContent>
      <DialogFooter>
        <Button>Cancelar</Button>
        <Button>Guardar</Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>

</template>

<style scoped>

</style>