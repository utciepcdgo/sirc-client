<script lang="ts" setup>
import {
	DialogFooter,
	DialogHeader,
	DialogScrollContent,
	DialogTitle,
} from '@/components/ui/dialog';
import { DialogRoot } from 'radix-vue';
import { Button } from '@/components/ui/button';
import Form from '@/components/Edition/Form.vue';
import { defineProps } from 'vue';

defineProps<{
	registration?: Record<string, any>;
}>();

const emit = defineEmits(['closeEditionModal']);
</script>

<template>
	<DialogRoot>
		<DialogScrollContent class="min-w-[80%]">
			<DialogHeader>
				<DialogTitle>Detalles del Registro</DialogTitle>
			</DialogHeader>
			<Form :registration="registration ?? {}" />
			<DialogFooter>
				<Button form="edition_form" type="submit">
					Guardar registro
				</Button>
				<Button
					variant="destructive"
					@click="$emit('closeEditionModal')">
					Cancelar
				</Button>
			</DialogFooter>
		</DialogScrollContent>
	</DialogRoot>
</template>

<style scoped></style>
