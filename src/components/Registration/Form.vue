<script setup lang="ts">

import {Form as VeeForm, Field, ErrorMessage} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/yup';
import * as yup from 'yup';
import {Select} from "@/components/ui/select";

const states = {
  data: [
    {
      id: 1,
      name: "Aguascalientes",
      abbreviation: "AGS",
      shield: ""
    },
    {
      id: 2,
      name: "Baja California",
      abbreviation: "BC",
      shield: ""
    }
  ]
}

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
    state: yup.string()
        .required('El campo Estado es requerido'),
    municipality: yup.string().required().min(3),
  })
})

function onSubmit(values) {
  // Submit values to API...
  alert(JSON.stringify(values, null, 2));
}

const initialData = {}

</script>

<template>
  <VeeForm @submit="onSubmit" :validation-schema="schema">
    <Field name="name"/>
    <ErrorMessage name="name"/>

    <Field name="first_name"/>
    <ErrorMessage name="first_name"/>

    <Field name="second_name"/>
    <ErrorMessage name="second_name"/>

    <Field name="birthplace.birth" type="date"/>
    <ErrorMessage name="birthplace.birth"/>

    <select name="birthplace.state">
      <option value="-1">Seleccione una opción</option>
      <option v-for="state in states.data" :value="state">{{ state.name + ' - ' + state.abbreviation }}</option>
    </select>
    <ErrorMessage name="birthplace.state"/>

    <Field name="birthplace.municipality"/>
    <ErrorMessage name="birthplace.municipality"/>

    <button>Submit</button>
  </VeeForm>
</template>

<style scoped>
input, select {
  width: 100%;
  padding: 0.1rem;
  border:1px solid #CCC;
}
</style>