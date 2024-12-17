<script setup lang="ts">
import {Input} from "@/components/ui/input";
import {toTypedSchema} from '@vee-validate/zod';
import {Separator} from "@/components/ui/separator";

import {useGenresStore} from "@/stores/genres.js";
import {useSexesStore} from "@/stores/sexes.js";
import {useCompensatoriesStore} from "@/stores/compensatories.js";

import {vMaska} from "maska/vue"

import {z} from 'zod';
import {useForm} from "vee-validate";

const props = defineProps({
  selectedBlock: {
    type: Object,
    required: true
  }
});

import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'

import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue} from '@/components/ui/select'

import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";

import {SelectRoot} from "radix-vue";
import Born from "@/components/Registration/Form/Modules/Born.vue";

const voterCardSchema = z.object({
  cic: z.string({required_error: 'Requerido'}).min(9).max(9).optional(),
  ocr: z.string({required_error: 'Requerido'}).min(13).max(13).optional(),
  section: z.string({required_error: 'Requerido'}).min(1).max(4).optional(),
  emission_number: z.string({required_error: 'Requerido'}).min(1).max(99).optional(),
});

const residenceSchema = z.object({
  city: z.string({required_error: 'Requerido'}).min(3).max(255),
  colony: z.string({required_error: 'Requerido'}).min(3).max(255),
  street: z.string({required_error: 'Requerido'}).min(3).max(255),
  postal_code: z.string({required_error: 'Requerido'}).min(3).max(5),
  outside_number: z.string({required_error: 'Requerido'}).min(3).max(255),
  length: z.object({
    years: z.number({required_error: 'Requerido'}).int().min(0)
        .max(99,
            {message: 'El valor máximo permitido es 99'}
        ),
    months: z.number().int().positive().min(0)
        .max(11,
            {message: 'El valor máximo permitido es 11'}
        ),
  })
})

const birthPlaceSchema = z.object({
  birth: z.string().date(),
  state: z.union([
    z.object({
      id: z.number().int().positive(),
      name: z.string(),
      abbreviation: z.string(),
      shield: z.string().nullable(),
    }),
    z.undefined()
  ]),
  municipality: z.union([
    z.object({
      id: z.number().int().positive(),
      name: z.string(),
      state_id: z.number().int().positive(),
    }),
    z.undefined()
  ])
})

const formSchema = toTypedSchema(z.object({
  name: z.string({required_error: 'Requerido'}).min(3, {message: 'Requiere mínimo 3 caracteres.'}).max(50, {message: 'Admite hasta 50 caracteres.'}),
  first_name: z.string({required_error: 'Requerido'}).min(3, {message: 'Requiere mínimo 3 caracteres.'}).max(50, {message: 'Admite hasta 50 caracteres.'}),
  second_name: z.string({required_error: 'Requerido'}).min(3, {message: 'Requiere mínimo 3 caracteres.'}).max(50, {message: 'Admite hasta 50 caracteres.'}),
  birthplace: birthPlaceSchema,
  residence: residenceSchema,
  occupation: z.string({required_error: 'Requerido'}).min(3, {message: 'Requiere mínimo 3 caracteres.'}).max(50),
  voter_key: z.string({required_error: 'Requerido'}).min(18, {message: 'Requiere mínimo 18 caracteres.'}).max(18, {message: 'Requiere hasta 18 caracteres.'}),
  curp: z.string({required_error: 'Requerido'}).regex(/([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/).min(18).max(18).toUpperCase(),
  voter_card: voterCardSchema,
  council_number: z.string(),
  block_id: z.number({required_error: 'Requerido'}).int().positive(),
  position_id: z.string({required_error: 'Seleccione una opción'}).min(1),
  postulation_id: z.string({required_error: 'Seleccione una opción'}).min(1),
  sex_id: z.string({required_error: 'Seleccione una opción'}).min(1),
  gender_id: z.string({required_error: 'Seleccione una opción'}).min(1),
}))


const store = {storeGender: useGenresStore(), storeSex: useSexesStore()}

const getGenres = computed(() => {
  return store.storeGender.getGenres || []
})

const getSexes = computed(() => {
  return store.storeSex.getSexes || []
})

onMounted(() => {
  store.storeGender.fetchGenres()
  store.storeSex.fetchSexes()
})

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

const showCouncilNumber = ref(false);

watch(() => form.values.postulation_id, (newVal) => {
  showCouncilNumber.value = newVal === '2'; // '2' es el valor para Regiduría
});

const states = ref();
const municipalities = ref();
const selectedState = ref(null);
const selectedMunicipality = ref(null);

// Obtener los estados al montar el componente
const statesOptions = {
  method: 'GET',
  url: import.meta.env.VITE_SERVICES_API_URI + 'states',
  headers: {authorization: 'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN}
};
onMounted(async () => {
  try {
    const {data} = await axios.request(statesOptions);
    states.value = data.data;
  } catch (error) {
    console.error(error);
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
</script>

<template>
  <form @submit.prevent="onSubmit" id="registration_form" selected-block="">
    <Input type="hidden" name="block_id" v-bind="componentField"/>
    <Born
        :form="form"
        :states="states"
        :municipalities="municipalities"
        :selectedState="selectedState"
        :selectedMunicipality="selectedMunicipality"
        @update:selectedState="selectedState = $event"
        @update:selectedMunicipality="selectedMunicipality = $event"
    />
  </form>
</template>

<style scoped>
</style>