<script lang="ts" setup>
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { IconDownload, IconLoader2, IconTrash } from '@tabler/icons-vue';
import { useLoadingStore } from '@/stores/loading';
import { useToast } from '@/components/ui/toast';
import { defineEmits, reactive } from 'vue';
import { File, Filetype } from '@/types/types';

const emit = defineEmits(['fileDeleted']);

const { toast } = useToast();
const loading = useLoadingStore();

const downloadingFiles = reactive<Record<number, boolean>>({});

const isDownloading = (fileId: number) => {
	return downloadingFiles[fileId] === true;
};

defineProps<{
	files: File[];
	formats: Filetype[];
}>();

async function deleteFormat(id: number) {
	try {
		loading.showLoading();
		await axios.delete(import.meta.env.VITE_SIRC_API_URI + `file/${id}`);
		toast({
			title: 'Archivo eliminado correctamente',
			variant: 'default',
		});
		emit('fileDeleted');
		loading.hideLoading();
	} catch (error) {
		console.error('Error al eliminar el archivo:', error);
		toast({
			title: 'Error al eliminar el archivo',
			variant: 'destructive',
		});
		loading.hideLoading();
	}
}

const downloadFile = async (fileId: number) => {
	try {
		downloadingFiles[fileId] = true;
		// Solicitar el enlace a la API
		const { data } = await axios.get(
			import.meta.env.VITE_SIRC_API_URI + `request-download/${fileId}`
		);

		if (data.success && data.url) {
			// window.location.href = data.url;
			window.open(data.url, '_blank');
		}
	} catch (error) {
		console.error('Error al obtener el enlace temporal:', error);

		toast({
			title: 'Error al solicitar la descarga',
			variant: 'destructive',
		});

		downloadingFiles[fileId] = false;
	} finally {
		downloadingFiles[fileId] = false;
	}
};
</script>

<template>
	<div>
		<h2 class="text-lg font-semibold mb-2">Archivos cargados</h2>
		<div class="overflow-x-auto">
			<Table>
				<TableCaption>Lista de archivos cargados.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Formato</TableHead>
						<TableHead>Formato del archivo</TableHead>
						<TableHead>Fecha de carga</TableHead>
						<TableHead class="text-right"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow
						v-for="file in files"
						:key="
							file && typeof file === 'object'
								? file.id
								: undefined
						">
						<TableCell class="font-medium">{{
							file?.filetype?.name
						}}</TableCell>
						<TableCell
							><Badge>{{
								file?.format.split('/')[1].toUpperCase()
							}}</Badge></TableCell
						>
						<TableCell>{{ file?.created_at }}</TableCell>
						<TableCell class="text-right">
							<AlertDialog>
								<AlertDialogTrigger>
									<Button
										variant="ghost"
										class="text-red-400">
										<IconTrash />
										Eliminar
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle
											>Eliminar
											{{
												file?.filetype?.name.toLowerCase()
											}}</AlertDialogTitle
										>
										<AlertDialogDescription>
											¿Está seguro que desea eliminar este
											archivo permanentemente? Esta acción
											no se puede deshacer.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel
											>Cancelar</AlertDialogCancel
										>
										<AlertDialogAction
											@click="deleteFormat(file?.id)">
											Eliminar
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>

							<Button
								:disabled="isDownloading(file?.id)"
								variant="link"
								@click="downloadFile(file?.id)">
								<IconDownload
									v-show="!isDownloading(file?.id)" />
								<IconLoader2
									class="animate-spin"
									v-show="isDownloading(file?.id)" />
								{{
									isDownloading(file?.id)
										? 'Solicitando enlace...'
										: 'Descargar'
								}}
							</Button>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	</div>
</template>

<style scoped></style>
