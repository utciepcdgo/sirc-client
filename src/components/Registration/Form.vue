<script setup lang="ts">
import {Input} from "@/components/ui/input";

import Born from "@/components/Registration/Form/Modules/Born.vue";
import Candidacy from "@/components/Registration/Form/Modules/Candidacy.vue";
import VoterCard from "@/components/Registration/Form/Modules/VoterCard.vue";
import Residence from "@/components/Registration/Form/Modules/Residence.vue";
import GeneralInformation from "@/components/Registration/Form/Modules/GeneralInformation.vue";

// import Schemas for the form validations
import {generalSchema} from "@/components/Registration/Form/Schemas/general";

import {toTypedSchema} from '@vee-validate/zod';
import {Form as VeeForm, Field, ErrorMessage} from 'vee-validate';

import * as yup from 'yup';

const props = defineProps({
  selectedBlock: {
    type: Object,
    required: false
  }
});

const schema = yup.object({
  name: yup.string().required().min(3),
  first_name: yup.string().required().min(3),
  second_name: yup.string().required().min(3),
  birthplace: yup.object().shape({
    birth: yup.date().required('El campo es requerido'),
    state: yup.string().required().min(3),
    municipality: yup.string().required().min(3),
  })
});

function onSubmit(values) {
  // Submit values to API...
  alert(JSON.stringify(values, null, 2));
}

const initialData = {}

</script>

<template>
  <VeeForm v-slot="{ handleSubmit }" :validation-schema="schema" as="div" :initial-values="initialData">
    <form @submit="handleSubmit($event, onSubmit)">
      <Input name="name"/>
      <ErrorMessage name="name"/>

      <Input name="first_name"/>
      <ErrorMessage name="first_name"/>

      <Input name="second_name"/>
      <ErrorMessage name="second_name"/>

      <Input name="birthplace.birth" type="date"/>
      <ErrorMessage name="birthplace.birth"/>

      <Input name="birthplace.state"/>
      <ErrorMessage name="birthplace.state"/>

      <Input name="birthplace.municipality"/>
      <ErrorMessage name="birthplace.municipality"/>

      <button>Submit</button>
    </form>
  </VeeForm>
</template>

<style scoped>
</style>