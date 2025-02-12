<script setup lang="ts">

import {Button} from '@/components/ui/button'

const props = defineProps<{
  files: {
    required: true,
    type: Object,
  },
  formats: Object
}>()

</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-2">Archivos cargados</h2>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
        <tr>
          <th class="text-left">Nombre</th>
          <th class="text-left">Tipo</th>
          <th class="text-left">Fecha de carga</th>
          <th class="text-left">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="file in formats" :key="file.id">
          <td>{{ file.name }}</td>
          <td>{{ file.type }}</td>
          <td>{{ file.created_at }}</td>
          <td>
            <Button variant="destructive">
              Eliminar
            </Button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>