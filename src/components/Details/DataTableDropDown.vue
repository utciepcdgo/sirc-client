<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-vue-next';
import { ref } from 'vue';
import { IconClipboard, IconPdf, IconUpload } from '@tabler/icons-vue';

import {
  amceePdf,
  candidacyPdf,
  disabilityPdf,
  diversityPdf,
  indigenousPdf,
  migrantPdf,
  protestPdf,
  reelectionPdf,
  violencyPdf,
} from '@/components/Documents/functions';
import { currentUnixTime } from '@/components/Documents/utils';
import MigrantDataModal from '@/components/Details/MigrantDataModal.vue';
import { useLoadingStore } from '@/stores/loading';
import { Registration } from '@/types/types';

const loadingStore = useLoadingStore();

defineProps<{
  registration: Registration;
}>();

function copy(id: string) {
  navigator.clipboard.writeText(id);
}

let openingMigrantDetails = ref(false);

async function downloadPdf(pdfFunction: Function, registration: object, fileName: string) {
  // If the pdf function is 'migrantPdf', first, check if the migrant data in registration.migrant isn't null,
  // next and if it is, open the modal, otherwise, generate the pdf
  if (pdfFunction === migrantPdf) {
    openingMigrantDetails.value = true;
    return;
  }
  loadingStore.showLoading('Generando formato ' + fileName.replace(/_/g, ' '));

  const pdfFormat = await pdfFunction(registration);

  loadingStore.hideLoading();
  // Create a download link
  if (pdfFunction !== protestPdf) {
    const blob = new Blob([pdfFormat], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + '_' + currentUnixTime() + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
</script>

<template>
  <MigrantDataModal :registration="registration" v-model:open="openingMigrantDetails" />
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Abrir menú de opciones</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
      <DropdownMenuItem @click="copy(registration.uuid)">
        <IconClipboard class="mr-2 h-4 w-4" />
        Copiar ID de registro
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <IconPdf class="mr-2 h-4 w-4" />
          <span>Formatos</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              :disabled="registration.compensatory.id !== '2'"
              @click="downloadPdf(disabilityPdf, registration, 'Discapacidad_Permanente')">
              <span>1. Discapacidad permanente</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :disabled="registration?.compensatory?.id !== '3'"
              @click="downloadPdf(diversityPdf, registration, 'Diversidad_Sexual')">
              <span>2. Diversidad sexual</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :disabled="registration?.compensatory?.id !== '5'"
              @click="downloadPdf(migrantPdf, registration, 'Migrante')">
              <span>3. Migrante</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :disabled="registration?.compensatory?.id !== '6'"
              @click="downloadPdf(indigenousPdf, registration, 'Indígena')">
              <span>4. Indígena</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadPdf(candidacyPdf, registration, 'Aceptación_de_Candidatura')">
              <span>6. Aceptación de Candidatura</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadPdf(protestPdf, registration, 'Carta_Bajo_Protesta')">
              <span>7. Carta bajo protesta</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :disabled="registration?.reelection !== 'Si'"
              @click="downloadPdf(reelectionPdf, registration, 'Elección_Consecutiva')">
              <span>8. Elección consecutiva</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadPdf(violencyPdf, registration, '8_de_8_contra_la_violencia')">
              <span>9. 8 de 8 contra la violencia</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :disabled="registration?.sex?.id !== '1'"
              @click="downloadPdf(amceePdf, registration, 'Red_Candidatas')">
              <span>10. Red de Candidatas y Mujeres Electas.</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <IconUpload class="mr-2 h-4 w-4" />
        Archivos cargados
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped></style>
