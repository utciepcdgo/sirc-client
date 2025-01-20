<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,} from '@/components/ui/dropdown-menu'
import {MoreHorizontal} from 'lucide-vue-next'
import {
  IconClipboard,
  IconPdf,
  IconExchange,
  IconPencil
} from '@tabler/icons-vue';

import {amceePdf, candidacyPdf, disabilityPdf, diversityPdf, indigenousPdf, migrantPdf, reelectionPdf} from '@/components/Documents/functions';
import {currentUnixTime} from '@/components/Documents/utils';

defineProps<{
  registration: {
    id: string,
    uuid: string,
  }
}>()

function copy(id: string) {
  navigator.clipboard.writeText(id)
}

async function message(registration: object) {

  const disabilityPdfFormat = await amceePdf(registration)

  // Crear un enlace de descarga
  const blob = new Blob([disabilityPdfFormat], {type: 'application/pdf'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = registration.name + '_' + currentUnixTime() + '.pdf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4"/>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="copy(registration.uuid)">
        <IconClipboard class="mr-2 h-4 w-4"/>
        Copiar ID de registro
      </DropdownMenuItem>
      <DropdownMenuSeparator/>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <IconPdf class="mr-2 h-4 w-4"/>
          <span>Formatos</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem @click="message(registration)">
              <span>1. Discapacidad permanente</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span>2. Diversidad sexual</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>3. Migrante</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>4. Indígena</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>6. Aceptación de Candidatura</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>7. Carta bajo protesta</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>8. Elección consecutiva</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>9. 8 de 8 contra la violencia</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>10. Red de Candidatas y Mujeres Electas.</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator/>
      <DropdownMenuItem>
        <IconPencil class="mr-2 h-4 w-4"/>
        Editar
      </DropdownMenuItem>
      <DropdownMenuItem>
        <IconExchange class="mr-2 h-4 w-4"/>
        Sustituír
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped>

</style>