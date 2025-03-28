<!--suppress ALL -->
<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { onMounted } from 'vue';
import axios from 'axios';
import GeneralInformation from '@/components/Registration/Form/Modules/GeneralInformation.vue';
import { useCompensatoryStore } from '@/stores/compensatories';
import { useGenresStore } from '@/stores/genres';
import { usePostulationsStore } from '@/stores/postulations';
import { useLoadingStore } from '@/stores/loading';
import VoterCard from '@/components/Registration/Form/Modules/VoterCard.vue';
import { registrationSchema } from '@/components/Registration/Form/Schemas/registration';
import { useToast } from '@/components/ui/toast';
import Born from '@/components/Registration/Form/Modules/Born.vue';
import Residence from '@/components/Registration/Form/Modules/Residence.vue';
import Candidacy from '@/components/Registration/Form/Modules/Candidacy.vue';
import { Registration } from '@/types/types';
import { useBlocksStore } from '@/stores/blocks';
import { useLocationStore } from '@/stores/location';
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
const emit = defineEmits(['closeSubstitutionModal']);

onMounted(async () => {
  await store.storeCompensatory.fetchCompensatory();
  await store.storeGender.fetchGenres();
  await store.storePostulation.fetchPostulations();
  await store.storeLocation.fetchStates();
});

// @ts-ignore
const { values, handleSubmit } = useForm<InferType<typeof registrationSchema>>({
  validationSchema: toTypedSchema(registrationSchema),
  initialValues: {
    block_id: props.registration?.block?.id,
    registration_id: props.registration?.id,
    postulation_id: props.registration?.postulation?.id,
    position_id: props.registration?.position.id,
    council_number:
      props.registration?.council_number !== null && props.registration?.council_number !== undefined
        ? props.registration?.council_number.toString()
        : '',
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    // Evitar que se envíe el formulario si postulation_id y position_id no coinciden con los valores de registration
    if (
      values.postulation_id !== props.registration.postulation.id ||
      values.position_id !== props.registration.position.id
    ) {
      toast({
        title: 'Error',
        description: 'No se permite cambiar la postulación o el carácter del registro tratándose de una sustitución.',
        variant: 'destructive',
      });

      return;
    }

    store.storeLoading.showLoading('Enviando información...');

    await axios.post(import.meta.env.VITE_SIRC_API_URI + `registrations/${props.registration.id}/substitute`, values, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // Cerrar pantalla de carga
    store.storeLoading.hideLoading();

    // Mostrar Toast de éxito
    toast({
      title: 'Éxito',
      description: 'Registro sustituido correctamente.',
    });

    emit('closeSubstitutionModal');
  } catch (error) {
    toast({
      title: 'Error',
      description: `${error?.response?.data?.message}`,
      variant: 'destructive',
    });
  } finally {
    store.storeBlocks.fetchBlocks();
  }
});
</script>

<template>
  <form id="substitution_form" @submit.prevent="onSubmit">
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
      <Candidacy :form="values" :selected-block="registration.block" mode="substitution" />
    </div>
  </form>
</template>

<style scoped></style>
