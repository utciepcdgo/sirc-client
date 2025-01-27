<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,} from '@/components/ui/dropdown-menu'
import {MoreHorizontal} from 'lucide-vue-next'
import {ref} from "vue";
import {
  IconClipboard,
  IconPdf,
  IconExchange,
  IconPencil, IconFilePlus, IconNavigationNorth
} from '@tabler/icons-vue';

import {amceePdf, candidacyPdf, disabilityPdf, diversityPdf, indigenousPdf, migrantPdf, protestPdf, reelectionPdf} from '@/components/Documents/functions';
import {currentUnixTime} from '@/components/Documents/utils';
import MigrantDataModal from '@/components/Details/MigrantDataModal.vue';

defineProps<{
  registration: {
    id: string,
    uuid: string,
    name: string
  }
}>()

function copy(id: string) {
  navigator.clipboard.writeText(id)
}

let openingMigrantDetails = ref(false)

async function downloadPdf(pdfFunction: Function, registration: object, fileName: string) {
  // If the pdf function is 'migrantPdf', first, check if the migrant data in registration.migrant isn't null,
  // next and if it is, open the modal, otherwise, generate the pdf
  if (pdfFunction === migrantPdf) {
    openingMigrantDetails.value = true
    return
  }

  const pdfFormat = await pdfFunction(registration)

  // Create a download link
  if (pdfFunction !== protestPdf) {
    const blob = new Blob([pdfFormat], {type: 'application/pdf'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName + '_' + currentUnixTime() + '.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

</script>

<template>
  <MigrantDataModal :registration="registration" v-model:open="openingMigrantDetails"/>
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
            <DropdownMenuItem @click="downloadPdf(disabilityPdf, registration, 'Discapacidad_Permanente')">
              <span>1. Discapacidad permanente</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadPdf(diversityPdf, registration, 'Diversidad_Sexual')">
              <span>2. Diversidad sexual</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadPdf(migrantPdf, registration, 'Migrante')">
              <span>3. Migrante</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadPdf(indigenousPdf, registration, 'Indígena')">
              <span>4. Indígena</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadPdf(candidacyPdf, registration, 'Aceptación_de_Candidatura')">
              <span>6. Aceptación de Candidatura</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadPdf(protestPdf, registration, 'Carta_Bajo_Protesta')">
              <span>7. Carta bajo protesta</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadPdf(reelectionPdf, registration, 'Elección_Consecutiva')">
              <span>8. Elección consecutiva</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span>9. 8 de 8 contra la violencia</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadPdf(amceePdf, registration, 'Red_Candidatas')">
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