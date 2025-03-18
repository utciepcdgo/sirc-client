<script lang="ts" setup>
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IconDownload, IconLoader2 } from '@tabler/icons-vue';
import axios from 'axios';
import { reactive } from 'vue';
import { useToast } from '@/components/ui/toast';

defineProps({
  receipts: {
    type: Object,
    required: true,
  },
});

const downloadingFiles = reactive({});
const { toast } = useToast();

const isDownloading = (receiptId) => {
  return downloadingFiles[receiptId] === true;
};

const download = async (receiptId) => {
  try {
    downloadingFiles[receiptId] = true;
    // Solicitar el enlace a la API
    const { data } = await axios.get(import.meta.env.VITE_SIRC_API_URI + `receipt/download/${receiptId}`);

    if (data.success && data.url) {
      // Opción 1: Redireccionar la ventana actual
      // window.location.href = data.url;

      // Opción 2: Abrir en una nueva pestaña (descomentar si se prefiere)
      window.open(data.url, '_blank');
    }
  } catch (error) {
    console.error('Error al obtener el enlace temporal:', error);

    toast({
      title: 'Error al solicitar la descarga',
      variant: 'destructive',
    });

    downloadingFiles[receiptId] = false;
    // Aquí puedes agregar lógica para mostrar una alerta al usuario
  } finally {
    downloadingFiles[receiptId] = false;
  }
};
</script>

<template>
  <Table>
    <TableCaption>Listado de sus acuses generados.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Acuse</TableHead>
        <TableHead>Hash</TableHead>
        <TableHead>Fecha solicitud</TableHead>
        <TableHead class="text-right"></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="receipt in receipts" :key="receipt.id">
        <TableCell class="text-xs">{{ receipt.name }}</TableCell>
        <TableCell class="text-xs">{{ receipt.sha256 }}</TableCell>
        <TableCell>{{ receipt.created_at }}</TableCell>
        <TableCell class="text-right">
          <Button :disabled="isDownloading(receipt.id)" variant="link" @click="download(receipt.id)">
            <IconDownload v-show="!isDownloading(receipt.id)" />
            <IconLoader2 v-show="isDownloading(receipt.id)" class="animate-spin" />
            {{ isDownloading(receipt.id) ? 'Solicitando enlace...' : 'Descargar' }}
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<style scoped></style>
