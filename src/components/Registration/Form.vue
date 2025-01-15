<!--suppress ALL -->
<script setup lang="ts">

import {Field, ErrorMessage, useForm, defineRule} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/yup';
import {object, string, number, date} from 'yup';
import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";
import {vMaska} from "maska/vue"

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {FingerprintSpinner} from "epic-spinners";
import {VisuallyHidden} from "radix-vue";
import {useCompensatoryStore} from "@/stores/compensatories";
import {useGenresStore} from "@/stores/genres";
import {usePostulationsStore} from "@/stores/postulations";

const store = {storeCompensatory: useCompensatoryStore(), storeGender: useGenresStore(), storePostulation: usePostulationsStore()}

const getCompensatory = computed(() => {
  return store.storeCompensatory.getCompensatory || []
})

const getGenres = computed(() => {
  return store.storeGender.getGenres || []
})

const getPostulations = computed(() => {
  return store.storePostulation.getPostulations || []
})

// Getting states from API
const loadingStates = ref(false);
const states = ref([]);
const municipalities = ref([]);
const municipalitiesFromResidence = ref([]);
const selectedState = ref(null);
const selectedStateFromResidence = ref(null);
const isLoading = ref(false);
const postulation = ref(0);
const isError = ref({there: false, error: ''});

const fetchStates = async () => {
  loadingStates.value = true;
  isLoading.value = true;
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
    isLoading.value = false;
  }
};

const fetchMunicipalities = async (stateId, field) => {
  isLoading.value = true;
  try {
    const response = await axios.get(import.meta.env.VITE_SERVICES_API_URI + `municipalities/${stateId}`, {
      headers: {authorization: 'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN}
    });

    console.log("field: ", field);
    field == 1 ? (municipalities.value = response.data.data) : (municipalitiesFromResidence.value = response.data.data);

  } catch (error) {
    console.error('Error al obtener los municipios:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  store.storeCompensatory.fetchCompensatory();
  store.storeGender.fetchGenres();
  store.storePostulation.fetchPostulations();

  await fetchStates();

  // Field 1 is for birthplace
  watch(selectedState, async (newState) => {
    console.log("selectedState ", selectedState)
    if (newState) {
      await fetchMunicipalities(newState.id, 1);
    } else {
      municipalities.value = [];
    }
  });

  // Field 2 is for residence
  watch(selectedStateFromResidence, async (newState) => {
    console.log("selectedStateFromResidence ", selectedStateFromResidence)
    if (newState) {
      await fetchMunicipalities(newState.id, 2);
    } else {
      municipalitiesFromResidence.value = [];
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
        name: string().required(),
        abbreviation: string().required(),
        shield: string().optional(),
      }),
      municipality: object().shape({
        id: string().required(),
        name: string().required(),
        state_id: string().required(),
      }),
    }),
    residence: object().shape({
      state: object().shape({
        id: number().required(),
        name: string().required(),
        abbreviation: string().required(),
        shield: string().optional(),
      }),
      municipality: string().min(3).max(255).required(),
      city: string().min(3).max(255).required(),
      colony: string().min(3).max(255).required(),
      street: string().min(3).max(255).required(),
      postal_code: string().min(3).max(5).required(),
      outside_number: number().optional().default(0),
      inside_number: number().optional().default(0),
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
    postulation_id: number().required(),
    council_number: number().when('postulation_id', {
      is: (postulation_id) => postulation_id === 6,
      then: (s) => s.label('Posición').required(),
      otherwise: (s) => s,
    }),
    sex_id: number().required(),
    compensatory_id: number().required(),
    gender_id: number().when('compensatory_id', {
      is: (compensatory_id) => {
        console.log(compensatory_id === 3);
        return compensatory_id === 3;
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
    },
    voter_card: {
      section: '0000',
    },
  }
});

const onSubmit = handleSubmit(async (values) => {
  // Submit values to API...
  alert(JSON.stringify(values, null, 4));

  try {
    await axios.post('http://localhost:8000/api/registrations', values);
    // successMessage.value = 'Formulario enviado con éxito';
  } catch (error) {
    isError.value = {there: true, error: error.response.data.message};
    console.error('Error al enviar el formulario:', error.response.data.message);
  }
})

</script>

<template>
  <form @submit.prevent="onSubmit" id="registration_form">

    <AlertDialog v-model:open="isError.there">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>
            Hubo un error al intentar guardar el registro.
            <p class="mt-3 p-0 leading-none">Detalles:</p>
            <p class="italic text-red-600 leading-none">{{ isError.error }}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Aceptar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog v-model:open="isLoading">
      <AlertDialogContent class="w-[177.6px] bg-transparent border-0 shadow-none">
        <VisuallyHidden>
          <AlertDialogTitle>Cargando...</AlertDialogTitle>
        </VisuallyHidden>
        <fingerprint-spinner
            :animation-duration="1500"
            :size="128"
            :color="'#ffffff'"/>
        <p class="text-center font-bold text-white">Cargando...</p>
      </AlertDialogContent>
    </AlertDialog>

    <div class="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
      <div class="border border-slate-400 rounded-md p-4 relative mt-10">
        <header class="mx-auto max-w-2xl text-center absolute left-0 right-0 top-[-23px]">
          <h1 class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl inline-block bg-white px-4">Información General</h1>
          <p class="text-sm font-semibold text-gray-400 hidden xl:block">Nombre(s), ocupación y CURP</p>
        </header>

        <GeneralInformation/>
      </div>

      <div class="border border-slate-400 rounded-md p-4 relative mt-10">
        <header class="mx-auto max-w-2xl text-center absolute left-0 right-0 top-[-23px]">
          <h1 class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl inline-block bg-white px-4">Credencial para votar</h1>
          <p class="text-sm font-semibold text-gray-400 hidden xl:block">Indique los campos solicitados, tales como CIC, Clave de Elector, entre otros.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-5">
          <div class="grid sm:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <Label for="voter_card.cic">CIC</Label>
              <Field as="input"
                     type="text"
                     name="voter_card.cic"
                     v-maska="'#########'"/>
              <ErrorMessage name="voter_card.cic"/>
            </div>
            <div>
              <Label for="voter_card.ocr">OCR</Label>
              <Field as="input"
                     type="text"
                     name="voter_card.ocr"
                     v-maska="'#############'"/>
              <ErrorMessage name="voter_card.ocr"/>
            </div>
          </div>
          <div class="grid sm:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <Label for="voter_card.section">Sección</Label>
              <Field as="input" type="text" name="voter_card.section" v-maska="'####'" data-maska-tokens="0:[0-9]" data-maska-eager="false"/>
              <ErrorMessage name="voter_card.section"/>
            </div>
            <div>
              <Label for="voter_card.emission_number">Número de emisión</Label>
              <Field as="input"
                     type="text"
                     name="voter_card.emission_number"
                     v-maska="'##'"/>
              <ErrorMessage name="voter_card.emission_number"/>
            </div>
          </div>
          <div class="sm:col-span-1 md:col-span-2 xl:col-span-2 2xl:col-span-1">
            <Label for="voter_key">Clave de Elector</Label>
            <Field as="input" type="text" name="voter_key" v-maska="'@@@@@@########@###'"/>
            <ErrorMessage name="voter_key"/>
          </div>
        </div>
      </div>
    </div>
    <div class="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
      <div class="border border-slate-400 rounded-md p-4 relative mt-10">
        <header class="mx-auto max-w-2xl text-center absolute left-0 right-0 top-[-23px]">
          <h1 class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl inline-block bg-white px-4">Fecha y lugar de nacimiento</h1>
          <p class="text-sm font-semibold text-gray-400 hidden xl:block">Indique la fecha de nacimiento, además del Estado y Municipio correspondiente</p>
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
          <p class="text-sm font-semibold text-gray-400 hidden xl:block">Información relacionada con el domicilio y el tiempo de residencia</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-5">
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <Label for="residence.state">Estado</Label>
              <Field as="select" name="residence.state" v-model="selectedStateFromResidence">
                <option :value="undefined">Seleccione una opción</option>
                <option v-for="state in states" :key="state.id" :value="state">{{ state.name }}</option>
              </Field>
              <ErrorMessage name="residence.state"/>
            </div>
            <div>
              <Label for="residence.municipality">Municipio</Label>
              <Field as="select" name="residence.municipality" :disabled="!selectedStateFromResidence">
                <option :value="undefined">Seleccione una opción</option>
                <option v-for="municipality in municipalitiesFromResidence" :key="municipality.id" :value="municipality.name">{{ municipality.name }}</option>
              </Field>
              <ErrorMessage name="residence.municipality"/>
            </div>
          </div>
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
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
          </div>
          <div class="sm:col-span-1 md:col-span-2 xl:col-span-2 2xl:col-span-1">
            <Label for="residence.street">Calle</Label>
            <Field as="input" type="text" name="residence.street" v-slot="{field}">
              <input type="text" name="residence.street" v-bind="field">
            </Field>
            <ErrorMessage name="residence.street"/>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-4 mt-5">
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <Label for="residence.postal_code">Código Postal</Label>
              <Field as="input" name="residence.postal_code" v-maska="'#####'"/>
              <ErrorMessage name="residence.postal_code"/>
            </div>
            <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4 border border-slate-400 rounded-md p-2">
              <div>
                <Label for="residence.outside_number">Número interior</Label>
                <Field as="input" name="residence.outside_number"/>
                <ErrorMessage name="residence.outside_number"/>
              </div>
              <div>
                <Label for="residence.inside_number">Número exterior</Label>
                <Field as="input" name="residence.inside_number"/>
                <ErrorMessage name="residence.inside_number"/>
              </div>
              <div class="md:col-span-2 col-span-1 text-gray-500 text-sm">Si su dirección no cuenta con número interior y/o exterior, deje un 0 (cero)</div>
            </div>
          </div>
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <Label for="residence.length.years">Años</Label>
              <Field as="input" type="text" name="residence.length.years"/>
              <ErrorMessage name="residence.length.years"/>
            </div>
            <div>
              <Label for="residence.length.months">Meses</Label>
              <Field as="input" type="text" name="residence.length.months"/>
              <ErrorMessage name="residence.length.months"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-cols-1 gap-4">
      <div class="border border-slate-400 rounded-md p-4 relative mt-10">
        <header class="mx-auto max-w-2xl text-center absolute left-0 right-0 top-[-23px]">
          <h1 class="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl inline-block bg-white px-4">Candidatura</h1>
          <p class="text-sm font-semibold text-gray-400 hidden xl:block">Ingrese la información referente al cargo por el que se postula</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-5">
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <Label for="postulation_id">Postulación</Label>
              <Field as="select" name="postulation_id" v-model="postulation">
                <option :value="undefined">Seleccione una opción</option>
                <option v-for="postulation in getPostulations" :key="postulation.id" :value="postulation.id" :disabled="!postulation.active">{{ postulation.name }}</option>
              </Field>
              <ErrorMessage name="postulation_id"/>
              {{ postulation }}
            </div>
            <div v-show="postulation === 5">
              <Label for="council_number">Posición</Label>
              <Field as="select" name="council_number">
                <option :value="undefined">Seleccione una opción</option>
                <option v-for="i in selectedBlock.municipality.councils" :key="i" :value="i" :disabled="!selectedBlock.assignments?.councils.list.includes(i) && selectedBlock.assignments?.councils.list.length > 0">{{ i }}</option>
              </Field>
              <ErrorMessage name="council_number"/>
              {{ selectedBlock.assignments?.councils.list }}
            </div>
          </div>
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <Label for="position_id">Carácter</Label>
              <Field as="select" name="position_id">
                <option :value="undefined">Seleccione una opción</option>
                <option :value="1">Propietaria/o</option>
                <option :value="2">Suplencia</option>
              </Field>
              <ErrorMessage name="position_id"/>
            </div>
            <div>
              <Label for="reelection">Periodo de reelección</Label>
              <Field as="select" name="reelection">
                <option :value="undefined">Seleccione una opción</option>
                <option value="SI">Sí (2022-2025)</option>
                <option value="NO">No</option>
              </Field>
              <ErrorMessage name="reelection"/>
            </div>
          </div>
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <Label for="compensatory_id">Medida Compensatoria</Label>
              <Field as="select" name="compensatory_id">
                <option :value="undefined">Seleccione una opción</option>
                <option v-for="compensatory in getCompensatory" :value="compensatory.id" :key="compensatory.id">{{ compensatory.name }}</option>
              </Field>
              <ErrorMessage name="compensatory_id"/>
            </div>
            <div>
              <Label for="gender_id">Género</Label>
              <Field as="select" name="gender_id">
                <option :value="undefined">Seleccione una opción</option>
                <option v-for="gender in getGenres" :key="gender.id" :value="gender.id">{{ gender.name }}</option>
              </Field>
              <ErrorMessage name="gender_id"/>
            </div>
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