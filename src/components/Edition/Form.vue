<script lang="ts" setup>
import VoterCard from '@/components/Registration/Form/Modules/VoterCard.vue';
import GeneralInformation from '@/components/Registration/Form/Modules/GeneralInformation.vue';
import { onMounted } from 'vue';
import { useCompensatoryStore } from '@/stores/compensatories';
import { useGenresStore } from '@/stores/genres';
import { useLoadingStore } from '@/stores/loading';
import { usePostulationsStore } from '@/stores/postulations';
import { useBlocksStore } from '@/stores/blocks';
import { registrationSchema } from '@/components/Registration/Form/Schemas/registration';
import axios from 'axios';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { useToast } from '@/components/ui/toast';
import { Registration } from '@/types/types';
import Born from '@/components/Registration/Form/Modules/Born.vue';
import Residence from '@/components/Registration/Form/Modules/Residence.vue';
import Candidacy from '@/components/Registration/Form/Modules/Candidacy.vue';
import { useLocationStore } from '@/stores/location';
import { emitBlockDataUpdate } from '@/composables/useBlockData';
import { InferType } from 'yup';

// Hook para el Toast
const { toast } = useToast();

const props = defineProps<{ registration?: Registration }>();

const store = {
  storeCompensatory: useCompensatoryStore(),
  storeGender: useGenresStore(),
  storePostulation: usePostulationsStore(),
  storeLoading: useLoadingStore(),
  storeBlocks: useBlocksStore(),
  storeLocation: useLocationStore(),
};

// Emitir eventos al padre
const emit = defineEmits(['closeEditionModal']);

onMounted(async () => {
  await store.storeCompensatory.fetchCompensatory();
  await store.storeGender.fetchGenres();
  await store.storePostulation.fetchPostulations();
  await store.storeLocation.fetchStates();

  if (props.registration.birthplace?.state) {
    store.storeLocation.municipalitiesBirthplace = await store.storeLocation.fetchMunicipalitiesByStateName(
      props.registration.birthplace.state,
    );

    // Prefill form fields
    setFieldValue('birthplace.state', props.registration.birthplace.state);
    setFieldValue('birthplace.municipality', props.registration.birthplace.municipality ?? null);

    // Optional: sync store
    store.storeLocation.selectedStateBirthplace = props.registration.birthplace.state;
    store.storeLocation.selectedMunicipalityBirthplace = props.registration.birthplace.municipality ?? '';
  }

  // 🔁 Residence
  if (props.registration.residence?.state) {
    store.storeLocation.municipalitiesResidence = await store.storeLocation.fetchMunicipalitiesByStateName(
      props.registration.residence.state,
    );

    // Prefill form fields
    setFieldValue('residence.state', props.registration.residence.state);
    setFieldValue('residence.municipality', props.registration.residence.municipality ?? null);

    // Optional: sync store
    store.storeLocation.selectedStateResidence = props.registration.residence.state;
    store.storeLocation.selectedMunicipalityResidence = props.registration.residence.municipality ?? '';
  }
});

// @ts-ignore
const { values, handleSubmit, setFieldValue } = useForm<InferType<typeof registrationSchema>>({
  validationSchema: toTypedSchema(registrationSchema),
  initialValues: {
    name: props.registration?.name ?? '',
    first_name: props.registration?.first_name ?? '',
    second_name: props.registration?.second_name ?? '',
    birthplace: {
      birth: props.registration?.birthplace?.birth?.split('T')[0].toString() ?? '',
      state: props.registration?.birthplace?.state,
      municipality: props.registration?.birthplace?.municipality ?? '',
    },
    residence: {
      state: props.registration?.residence?.state ?? '', // Ensure it's a string
      municipality: props.registration?.residence?.municipality ?? '',
      city: props.registration?.residence?.city ?? '',
      colony: props.registration?.residence?.colony ?? '',
      street: props.registration?.residence?.street ?? '',
      postal_code: props.registration?.residence?.postal_code ?? '',
      outside_number: props.registration?.residence?.outside_number.toString() ?? 'S/N',
      inside_number: props.registration?.residence?.inside_number.toString() ?? 'S/N',
      length: {
        years: props.registration?.residence?.length?.years ?? 0, // Ensure number
        months: props.registration?.residence?.length?.months ?? 0, // Ensure number
      },
    },
    occupation: props.registration?.occupation ?? '',
    voter_key: props.registration?.voter_key ?? '',
    curp: props.registration?.curp ?? '',
    voter_card: {
      cic: props.registration?.voter_card?.cic ?? '', // Ensure it's a string
      ocr: props.registration?.voter_card?.ocr ?? '',
      section: props.registration?.voter_card?.section ?? '',
      emission_number: props.registration?.voter_card?.emission_number ?? '',
    },
    postulation_id: props.registration?.postulation?.id ?? null,
    position_id: props.registration?.position?.id ?? null,
    council_number:
      props.registration?.council_number !== null && props.registration?.council_number !== undefined
        ? props.registration?.council_number.toString()
        : '',
    reelection: props.registration?.reelection ?? 'No',
    sex_id: props.registration?.sex?.id.toString() ?? null,
    compensatory_id: props.registration?.compensatory?.id.toString() ?? null,
    block_id: props.registration?.block?.id ?? null,
    gender_id: props.registration?.gender?.id.toString() ?? null,
    mote: props.registration?.mote ?? '',
    id: props.registration?.id ?? null,
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    store.storeLoading.showLoading('Actualizando información de registro...');
    await axios.patch(import.meta.env.VITE_SIRC_API_URI + `registrations/${props.registration?.id}`, values);
    store.storeLoading.hideLoading();

    store.storeLoading.showLoading('Actualizando registros...');

    await axios
      .get(import.meta.env.VITE_SIRC_API_URI + `blocks/${props.registration?.block?.id}?include=registrations`)
      .then((response) => {
        console.log('From datatable emit: ', response.data);
        emitBlockDataUpdate.emit('updateDatatable', response.data.data.registrations?.list || []);
      })
      .catch((error) => {
        alert('Error al obtener los registros:' + error);
      });

    store.storeLoading.hideLoading();
    // Update Datatable information after Update Registration :D
    // Emitir evento al padre para cerrar el modal
    emit('closeEditionModal');

    // Mostrar Toast de éxito
    toast({
      title: 'Éxito',
      description: 'Registro actualizado correctamente.',
    });

    // await store.storeBlocks.fetchBlocks();
    store.storeLoading.hideLoading();
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  }
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
      <Born :registration="registration" />
      <Residence />
    </div>
    <div class="grid-cols-1 gap-4">
      <Candidacy :form="values" :selected-block="registration.block" mode="edition" />
    </div>
  </form>
  <!--	<form id="edition_form" @submit.prevent="onSubmit">-->
  <!--		<input type="text" name="name" />-->
  <!--	</form>-->
</template>

<style scoped></style>
