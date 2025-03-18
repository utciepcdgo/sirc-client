<!--suppress ALL -->
<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
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
import { Block } from '@/types/types';
import { InferType } from 'yup';

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
}>();

// @ts-ignore
const { values, handleSubmit } = useForm<InferType<typeof registrationSchema>>({
  validationSchema: toTypedSchema(registrationSchema),
  initialValues: {
    block_id: props.selectedBlock?.id,
  },
  keepValuesOnUnmount: false,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await axios.post(import.meta.env.VITE_SIRC_API_URI + 'registrations', values);

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
    <Candidacy :form="values" :selected-block="props.selectedBlock" :mode="'registration'" />
  </form>
</template>

<style scoped></style>
