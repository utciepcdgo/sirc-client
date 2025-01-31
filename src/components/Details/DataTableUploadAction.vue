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

</template>

<style scoped>

</style>