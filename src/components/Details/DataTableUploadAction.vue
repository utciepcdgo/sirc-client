<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {IconUpload, IconExchange, IconPencil} from '@tabler/icons-vue'

defineProps<{
  registration: {
    id: string,
    uuid: string,
  }
}>()

function message(id: string) {
  alert(id)
}

</script>

<template>
  <div class="space-x-2.5">
    <Button>
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