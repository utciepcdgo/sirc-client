<script setup lang="ts">
import {Input} from "@/components/ui/input";
import {toTypedSchema} from '@vee-validate/zod';

import Born from "@/components/Registration/Form/Modules/Born.vue";
import Candidacy from "@/components/Registration/Form/Modules/Candidacy.vue";
import VoterCard from "@/components/Registration/Form/Modules/VoterCard.vue";
import Residence from "@/components/Registration/Form/Modules/Residence.vue";
import GeneralInformation from "@/components/Registration/Form/Modules/GeneralInformation.vue";

// import Schemas for the form validations
import {generalSchema} from "@/components/Registration/Form/Schemas/general";
import {z} from 'zod';

import {useForm} from "vee-validate";

const props = defineProps({
  selectedBlock: {
    type: Object,
    required: true
  }
});

import axios from "axios";

const formSchema = toTypedSchema(z.object(generalSchema))

const form = useForm({
  initialValues: {
    block_id: props.selectedBlock.id,
  },
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  values.block_id = props.selectedBlock.id
  console.log(values)

  try {
    await axios.post('http://localhost:8000/api/registrations', values);
    // successMessage.value = 'Formulario enviado con éxito';
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  }
})

</script>

<template>
  <form @submit.prevent="onSubmit" id="registration_form">
    <Input type="hidden" name="block_id" v-bind="componentField"/>

    <GeneralInformation/>
    <Born/>
    <Residence/>
    <VoterCard/>
    <Candidacy :selectedBlock="selectedBlock" :form="form"/>

    <pre>{{ form.values }}</pre>

  </form>
</template>

<style scoped>
</style>