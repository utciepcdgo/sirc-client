<script lang="ts" setup>
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import VoterCard from '@/components/Registration/Form/Modules/VoterCard.vue';
import FormHeader from '@/components/Registration/Form/Modules/FormHeader.vue';
import GeneralInformation from '@/components/Registration/Form/Modules/GeneralInformation.vue';
import { Input } from '@/components/ui/input';
import { computed, onMounted, ref, watch } from 'vue';
import { useCompensatoryStore } from '@/stores/compensatories';
import { useGenresStore } from '@/stores/genres';
import { useLoadingStore } from '@/stores/loading';
import { usePostulationsStore } from '@/stores/postulations';
import { useBlocksStore } from '@/stores/blocks';
import { registrationSchema } from '@/components/Registration/Form/Schemas/registration';
import { vMaska } from 'maska/vue';
import axios, { AxiosRequestConfig } from 'axios';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object } from 'yup';
import { useToast } from '@/components/ui/toast';
import { Registration, State, Municipality } from '@/types/types';
import Born from '@/components/Registration/Form/Modules/Born.vue';
import Residence from '@/components/Registration/Form/Modules/Residence.vue';
import Candidacy from '@/components/Registration/Form/Modules/Candidacy.vue';

// Hook para el Toast
const { toast } = useToast();

const props = defineProps<{ registration?: Registration }>();

const store = {
	storeCompensatory: useCompensatoryStore(),
	storeGender: useGenresStore(),
	storePostulation: usePostulationsStore(),
	storeLoading: useLoadingStore(),
	storeBlocks: useBlocksStore(),
};

const getCompensatory = computed(() => {
	return store.storeCompensatory.getCompensatory || [];
});

const getGenres = computed(() => {
	return store.storeGender.getGenres || [];
});

const getPostulations = computed(() => {
	return store.storePostulation.getPostulations || [];
});

// Emitir eventos al padre
const emit = defineEmits(['closeEditionModal']);

onMounted(async () => {
	await store.storeCompensatory.fetchCompensatory();
	await store.storeGender.fetchGenres();
	await store.storePostulation.fetchPostulations();
});

const { handleSubmit } = useForm<Registration>({
	validationSchema: toTypedSchema(object().shape(registrationSchema)),
	initialValues: {
		name: props.registration?.name,
		first_name: props.registration?.first_name,
		second_name: props.registration?.second_name,
		birthplace: {
			birth: props.registration?.birthplace?.birth,
		},
		residence: {
			city: props.registration?.residence.city,
			colony: props.registration?.residence.colony,
			street: props.registration?.residence.street,
			postal_code: props.registration?.residence.postal_code,
			outside_number: props.registration?.residence.outside_number,
			inside_number: props.registration?.residence.inside_number,
			length: {
				years: props.registration?.residence.length.years,
				months: props.registration?.residence.length.months,
			},
		},
		occupation: props.registration?.occupation,
		voter_key: props.registration?.voter_key,
		curp: props.registration?.curp,
		postulation_id: props.registration?.postulation.id,
		position_id: props.registration?.position.id,
		reelection: props.registration?.reelection,
		compensatory_id: props.registration?.compensatory.id,
		sex_id: props.registration?.sex.id,
		block_id: props.registration?.block.id,
		gender_id: props.registration?.gender.id,
		mote: props.registration?.mote,
	},
});

const onSubmit = handleSubmit(async (values) => {
	try {
		await axios.patch(
			`http://localhost:8000/api/registrations/${props.registration?.id}`,
			values
		);

		// Emitir evento al padre para cerrar el modal
		emit('closeEditionModal');

		// Mostrar Toast de éxito
		toast({
			title: 'Éxito',
			description: 'Registro actualizado correctamente.',
		});
		await store.storeBlocks.fetchBlocks();
	} catch (error) {
		console.error('Error al enviar el formulario:', error);
	}
});

const showCouncilNumber = computed(
	() => useForm()?.values?.postulation_id === 5
);
const showMote = computed(() => {
	const postulationId = useForm()?.values?.postulation_id ?? 0;
	const positionId = useForm()?.values?.position_id ?? 0;
	const registrationPostulationId = props.registration?.postulation.id ?? 0;
	const registrationPositionId = props.registration?.position.id ?? 0;

	return (
		(postulationId === 3 && positionId === 1) ||
		(registrationPostulationId === 4 && registrationPositionId === 1)
	);
});
</script>

<template>
	<form id="edition_form" @submit.prevent="onSubmit">
		<div class="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
			<div>
				<GeneralInformation :registration="registration" />
			</div>

			<div>
				<VoterCard />
			</div>
		</div>
		<div class="flex gap-4 sm:flex-col md:flex-row mt-4">
			<Born />
			<Residence />
		</div>
		<div class="grid-cols-1 gap-4">
			<Candidacy form="" selected-block="" />
		</div>
	</form>
</template>

<style scoped></style>
