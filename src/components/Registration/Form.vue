<script setup lang="ts">

import {Field, ErrorMessage, useForm, defineRule} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/yup';
import {object, string, number, date} from 'yup';
import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import GeneralInformation from "@/components/Registration/Form/Modules/GeneralInformation.vue";
import {Label} from "@/components/ui/label";

// const states = {
//   data: [
//     {
//       id: 1,
//       name: "Aguascalientes",
//       abbreviation: "AGS",
//       shield: ""
//     },
//     {
//       id: 2,
//       name: "Baja California",
//       abbreviation: "BC",
//       shield: ""
//     }
//   ]
// }

// Getting states from API
const loadingStates = ref(false);
const states = ref([]);
const municipalities = ref([]);
const selectedState = ref(null);

onMounted(async () => {
  loadingStates.value = true;
  try {
    const response = await axios.get(import.meta.env.VITE_SERVICES_API_URI + 'states', {
      headers: {authorization: 'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN}
    });
    states.value = response.data.data;
    console.log(states.value);
  } catch (error) {
    console.error(error);
  } finally {
    loadingStates.value = false;
  }

  watch(selectedState, async (newState) => {
    console.log("selectedState ", selectedState)
    if (newState) {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVICES_API_URI + `municipalities/${newState.id}`, {
          headers: {authorization: 'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN}
        });
        municipalities.value = response.data.data;
      } catch (error) {
        console.error('Error al obtener los municipios:', error);
      }
    } else {
      municipalities.value = [];
    }
  });
});

const props = defineProps({
  selectedBlock: {
    type: Object,
    required: false
  }
});

const {values, handleSubmit} = useForm({
  validationSchema: toTypedSchema(object().shape({
    name: string().required().min(3),
    first_name: string().required().min(3),
    second_name: string().required().min(3),
    birthplace: object().shape({
      birth: date().required('El campo Fecha es requerido'),
      state: object().shape({
        id: number().required(),
        name: string().required().transform(value => value.toUpperCase()),
        abbreviation: string().required(),
        shield: string().optional(),
      }),
      municipality: object().shape({
        id: string().required(),
        name: string().required().transform(value => value.toUpperCase()),
        state_id: string().required(),
      }),
    }),
    residence: object().shape({
      state: string().min(3).max(255).required().transform(value => value.toUpperCase()),
      municipality: string().min(3).max(255).required(),
      city: string().min(3).max(255).required(),
      colony: string().min(3).max(255).required(),
      street: string().min(3).max(255).required(),
      postal_code: string().min(3).max(5).required(),
      outside_number: number().min(3).max(9999).optional().default(1),
      inside_number: number().min(3).max(9999).optional().default(1),
      length: object().shape({
        years: number().min(0)
            .max(99, 'El valor máximo permitido es 99'),
        months: number().positive().min(0)
            .max(11, 'El valor máximo permitido es 11'),
      })
    }),
    occupation: string().required().min(3),
    voter_key: string().required().min(18),
    curp: string()
        .matches(/([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)
        .required()
    ,
    voter_card: object().shape({
      cic: string().min(9).max(9).optional(),
      ocr: string().min(13).max(13).optional(),
      section: string().min(1).max(4).optional(),
      emission_number: string().min(1).max(99).optional(),
    }),
    sex_id: number().required(),
    compensatory_measure: number().required(),
    gender_id: number().when('compensatory_measure', {
      is: (compensatory_measure) => {
        console.log(compensatory_measure === 3);
        return compensatory_measure === 3;
      },
      then: (s) => s.label('Género').required(),
      otherwise: (s) => s,
    })
  })),

  initialValues: {
    block_id: props.selectedBlock?.id,
    name: 'ALEJANDRO',
    first_name: 'PARRA',
    second_name: 'VILLA',
    birthplace: {
      birth: '1995-04-24',
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
  <form @submit.prevent="onSubmit" id="registration_form">

    <div class="border border-slate-400 rounded-md p-4 relative mt-10">
      <header class="mx-auto max-w-2xl text-center absolute left-0 right-0 top-[-23px]">
        <h1 class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl inline-block bg-white px-4">Información General</h1>
        <p class="text-sm font-semibold text-gray-400">Nombre(s), ocupación y CURP</p>
      </header>
      <GeneralInformation/>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="border border-slate-400 rounded-md p-4 relative mt-10">
        <header class="mx-auto max-w-2xl text-center absolute left-0 right-0 top-[-23px]">
          <h1 class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl inline-block bg-white px-4">Fecha y lugar de nacimiento</h1>
          <p class="text-sm font-semibold text-gray-400">Indique la fecha de nacimiento, además del Estado y Municipio correspondiente</p>
        </header>

        <div class="grid grid-cols-3 gap-4 mt-5">
          <div>
            <Label for="birthplace.birth">Fecha de nacimiento</Label>
            <Field as="input" type="date" name="birthplace.birth"/>
            <ErrorMessage name="birthplace.birth"/>
          </div>
          <div>
            <Label for="birthplace.state">Estado</Label>
            <Field as="select" name="birthplace.state" v-model="selectedState">
              <option :value="undefined">Seleccione una opción</option>
              <option v-for="state in states" :key="state.id" :value="state">{{ state.name }}</option>
            </Field>
            <ErrorMessage name="birthplace.state"/>
          </div>
          <div>
            <Label for="birthplace.municipality">Municipio</Label>
            <Field as="select" name="birthplace.municipality" :disabled="!selectedState">
              <option :value="undefined">Seleccione una opción</option>
              <option v-for="municipality in municipalities" :key="municipality.id" :value="municipality">{{ municipality.name }}</option>
            </Field>
            <ErrorMessage name="birthplace.municipality"/>
          </div>
        </div>
      </div>

      <div class="border border-slate-400 rounded-md p-4 relative mt-10">
        <header class="mx-auto max-w-2xl text-center absolute left-0 right-0 top-[-23px]">
          <h1 class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl inline-block bg-white px-4">Residencia</h1>
          <p class="text-sm font-semibold text-gray-400">Información relacionada con el domicilio y el tiempo de residencia</p>
        </header>

        <div class="grid grid-cols-4 gap-4 mt-5">
          <div>
            <Label for="residence.state">Estado</Label>
            <Field as="select" name="residence.state" v-model="selectedState">
              <option :value="undefined">Seleccione una opción</option>
              <option v-for="state in states" :key="state.id" :value="state.name">{{ state.name }}</option>
            </Field>
            <ErrorMessage name="residence.state"/>
          </div>
          <div>
            <Label for="birthplace.municipality">Municipio</Label>
            <Field as="select" name="birthplace.municipality" :disabled="!selectedState">
              <option :value="undefined">Seleccione una opción</option>
              <option v-for="municipality in municipalities" :key="municipality.id" :value="municipality.name">{{ municipality.name }}</option>
            </Field>
            <ErrorMessage name="birthplace.municipality"/>
          </div>
          <div>
            <Label for="residence.city">Ciudad</Label>
            <Field as="input" type="text" name="residence.city"/>
            <ErrorMessage name="residence.city"/>
          </div>
          <div>
            <Label for="residence.v">Colonia</Label>
            <Field as="input" type="text" name="residence.colony"/>
            <ErrorMessage name="residence.colony"/>
          </div>
          <div>
            <Label for="residence.street">Calle</Label>
            <Field as="input" type="text" name="residence.street" v-slot="{field}">
              <input type="text" name="residence.street" v-bind="field">
            </Field>
            <ErrorMessage name="residence.street"/>
          </div>
        </div>
      </div>
    </div>


  </form>
</template>

<style scoped>
input, select {
  width: 100%;
  padding: 0.1rem;
  border: 1px solid #CCC;
}
</style>