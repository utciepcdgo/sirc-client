<script setup lang="ts">

import {Field, ErrorMessage, useForm} from 'vee-validate';
import * as yup from 'yup';

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

const schema = yup.object().shape({
  name: yup.string().required().min(3),
  first_name: yup.string().required().min(3),
  second_name: yup.string().required().min(3),
  birthplace: yup.object().shape({
    birth: yup.date().required('El campo Fecha es requerido'),
    state: yup.object().shape({
      id: yup.number().required(),
      name: yup.string().required().uppercase({force: true}),
      abbreviation: yup.string().required(),
      shield: yup.string().optional(),
    }),
    municipality: yup.string().required().min(3),
  })
})

const {handleSubmit} = useForm({
  validationSchema: schema,
  initialValues: {
    name: 'ALEJANDRO',
    first_name: 'PARRA',
    second_name: 'VILLA',
    birthplace: {
      birth: '1995-04-24',
      state: states.data[0],
      municipality: 'DURANGO'
    }
  }
});

const onSubmit = handleSubmit((values) => {
  // Submit values to API...
  alert(JSON.stringify(values, null, 4));
})

</script>

<template>
  <form @submit.prevent="onSubmit">
    <Field name="name" :validate-on-change="true"/>
    <ErrorMessage name="name"/>

    <Field name="first_name" :validate-on-change="true"/>
    <ErrorMessage name="first_name"/>

    <Field name="second_name"/>
    <ErrorMessage name="second_name"/>

    <Field name="birthplace.birth" type="date"/>
    <ErrorMessage name="birthplace.birth"/>

    <label for="birthplace.state">Estado</label>
    <Field as="select" name="birthplace.state" label="Estado">
      <option :value="undefined">Seleccione una opción</option>
      <option v-for="state in states.data" :key="state.id" :value="state">{{ state.name }}</option>
    </Field>
    <ErrorMessage name="birthplace.state"/>

    <Field name="birthplace.municipality" v-on:change="console.log($el)"/>
    <ErrorMessage name="birthplace.municipality"/>

    <button>Submit</button>
  </form>
</template>

<style scoped>
input, select {
  width: 100%;
  padding: 0.1rem;
  border: 1px solid #CCC;
}
</style>