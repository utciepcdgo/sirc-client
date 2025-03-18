<script lang="ts" setup>
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ToastAction, useToast } from '@/components/ui/toast';
import { IconAlertTriangle, IconFileTypeXls } from '@tabler/icons-vue';
import { h, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import axios from 'axios';
import ReceiptTable from '@/components/Receipt/ReceiptTable.vue';

const authStore = useAuthStore();
const loadingStore = useLoadingStore();
const openReceiptModal = ref(false);
const privacyConditions = ref(false);
const receipts = ref();
const { toast } = useToast();

// Close the modal
const closeReceiptModal = () => {
  openReceiptModal.value = false;
};

const generateReceipt = async (entityId) => {
  loadingStore.showLoading('Generando acuse...');
  const response = await axios
    .post(import.meta.env.VITE_SIRC_API_URI + `receipt?entity_id=${entityId}`)
    .then((response) => {
      console.log('response', response.data.message);
      toast({
        title: response.data.message,
        description: 'Registros presentados con éxito.',
        action: h(
          ToastAction,
          {
            altText: 'Descargar.',
            onClick: () => {
              window.open(response.data.url, '_blank');
            },
          },
          {
            default: () => 'Descargar',
          },
        ),
      });
    })
    .catch((error) => {
      console.error('Error al obtener el recibo:', error);
      toast({
        title: 'Error al obtener el recibo',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    });
  console.log('response', response);
  loadingStore.hideLoading();
};

function handleTabChange(tab) {
  if (tab === 'generated') {
    getReceipts(authStore.user.entities[0].id);
  } else {
    privacyConditions.value = false;
  }
}

onMounted(async () => {
  // Si no hay usuario, llamamos a fetchUser() y esperamos a que se complete.
  if (!authStore.user) {
    await authStore.fetchUser();
  }

  getReceipts(authStore.user.entities[0].id);
});

// Get Receipts from API
const getReceipts = async (entityId) => {
  loadingStore.showLoading('Obteniendo Acuse...');
  const response = await axios
    .get(import.meta.env.VITE_SIRC_API_URI + `receipt?entity_id=${entityId}`)
    .then((response) => {
      console.log('response', response.data);
      receipts.value = response.data;
    })
    .catch((error) => {
      console.error('Error al obtener los recibos:', error);
      toast({
        title: 'Error al obtener los recibos',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    });
  console.log('response', response);
  loadingStore.hideLoading();
};
</script>

<template>
  <Dialog v-model:open="openReceiptModal">
    <DialogTrigger>
      <Button variant="default">
        <IconFileTypeXls />
        Presentar registros formalmente.
      </Button>
    </DialogTrigger>
    <DialogContent class="min-w-fit">
      <DialogHeader>
        <DialogTitle>Acuse de recepción</DialogTitle>
      </DialogHeader>
      <Tabs class="w-full justify-center" @update:model-value="handleTabChange($event)">
        <TabsList>
          <TabsTrigger as-child value="generate">
            <Button variant="ghost">Presentar información</Button>
          </TabsTrigger>
          <TabsTrigger as-child value="generated">
            <Button variant="ghost">Acuses generados</Button>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
          <div class="flex flex-col text-center justify-center max-w-md mx-auto">
            <IconAlertTriangle class="text-yellow-400 self-center my-6" size="64" stroke="1" />
            <p class="text-sm">
              Generar el acuse de recepción se asemeja a la presentación de la documentación física ante Oficialía de
              Partes, por tanto, la revisión de la documentación presentada por esta vía será revisada tan pronto como
              sea posible. ¿Está seguro de presentar formalmente los registros?
            </p>
          </div>
          <p class="my-4 max-w-md mx-auto">
            Para presentar solicitud debe estar de acuerdo con el aviso de privacidad, mismo que puede consultar
            <a
              class="underline"
              href="https://www.iepcdurango.mx/IEPC_DURANGO/documentos/2021/avisos_privacidad/mod_15_feb_2021/TECNICA/FORMATO%20AVISO%20PRIVACIDAD%20REGISTRO%20DE%20CANDIDATOS.pdf"
              target="_blank">
              aquí
            </a>
            .
          </p>
          <div class="flex items-center space-x-2 my-6">
            <Checkbox id="terms" v-model:checked="privacyConditions" />
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="terms">
              Acepto y estoy de acuerdo con el aviso de privacidad
            </label>
          </div>
          <DialogFooter>
            <Button
              :disabled="!privacyConditions"
              variant="destructive"
              @click="generateReceipt(authStore.user.entities[0].id)">
              Presentar registros formalmente
            </Button>
            <Button variant="secondary" @click="closeReceiptModal">Cancelar</Button>
          </DialogFooter>
        </TabsContent>
        <TabsContent value="generated">
          <ReceiptTable :receipts="receipts.data" />
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
