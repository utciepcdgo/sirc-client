<!--suppress ALL -->
<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object } from 'yup';
import { onMounted } from 'vue';
import axios from 'axios';
import GeneralInformation from '@/components/Registration/Form/Modules/GeneralInformation.vue';
import { useLoadingStore } from '@/stores/loading';
import { useBlocksStore } from '@/stores/blocks';
import { useLocationStore } from '@/stores/location';
import VoterCard from '@/components/Registration/Form/Modules/VoterCard.vue';
import { registrationSchema } from '@/components/Registration/Form/Schemas/registration';
import { useToast } from '@/components/ui/toast';
import Born from '@/components/Registration/Form/Modules/Born.vue';
import Residence from '@/components/Registration/Form/Modules/Residence.vue';
import Candidacy from '@/components/Registration/Form/Modules/Candidacy.vue';
import { Block, Registration } from '@/types/types';

const store = {
	storeLoading: useLoadingStore(),
	storeBlocks: useBlocksStore(),
	storeLocation: useLocationStore(),
};

// Emitir eventos al padre
const emit = defineEmits(['closeModal']);

// Hook para el Toast
const { toast } = useToast();

const props = defineProps<{
	selectedBlock: Block;
	editMode: Boolean; // True for edit mode, false for insert
	initialData: Registration; // Pre-filled data for edit mode
}>();

const { values, setValues, handleSubmit } = useForm({
	validationSchema: toTypedSchema(object().shape(registrationSchema)),
	initialValues: {
		block_id: props.selectedBlock?.id,
	},
	keepValuesOnUnmount: false,
});

const onSubmit = handleSubmit(async (values) => {
	try {
		await axios.post(
			import.meta.env.VITE_SIRC_API_URI + 'registrations',
			values
		);

		// Emitir evento al padre para cerrar el modal
		emit('closeModal');

		// Mostrar Toast de éxito
		toast({
			title: 'Éxito',
			description: 'Registro creado correctamente.',
		});
	} catch (error) {
		toast({
			title: 'Error',
			description: 'Hubo un error al aprocesar la información',
			variant: 'destructive',
		});
	} finally {
		// Fetch data
		store.storeBlocks.fetchBlocks();
		// Close modal
	}
});

onMounted(() => {
	store.storeLocation.fetchStates();

	if (props.editMode && props.initialData) {
		setValues({
			birthplace: {
				state: props.initialData.birthplace?.state || null,
				municipality:
					props.initialData.birthplace?.municipality || null,
			},
			residence: {
				state: props.initialData.residence?.state || null,
				municipality: props.initialData.residence?.municipality || null,
			},
		});

		store.storeLocation.selectedStateBorn =
			props.initialData?.birthpalce?.state || null;
		store.storeLocation.selectedMunicipalityBorn =
			props.initialData?.birthpalce?.municipality || null;

		store.storeLocation.selectedStateResidence =
			props.initialData?.residence?.state || null;
		store.storeLocation.selectedMunicipalityResidence =
			props.initialData?.residence?.municipality || null;
	}
});
</script>

<template>
	<form id="registration_form" @submit.prevent="onSubmit">
		<div class="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
			<div>
				<GeneralInformation />
			</div>

			<div>
				<VoterCard />
			</div>
		</div>
		<div class="flex gap-4 sm:flex-col md:flex-row mt-4">
			<Born />
			<Residence />
		</div>
		<Candidacy :form="values" :selected-block="props.selectedBlock" />
	</form>
</template>

<style scoped></style>
