<!--suppress ALL -->
<script lang="ts" setup>

import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/yup';
import {object} from 'yup';
import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";
import {vMaska} from "maska/vue"
import {Input} from '@/components/ui/input'
import GeneralInformation from "@/components/Registration/Form/Modules/GeneralInformation.vue";
import {AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/components/ui/alert-dialog";
import {useCompensatoryStore} from "@/stores/compensatories";
import {useGenresStore} from "@/stores/genres";
import {usePostulationsStore} from "@/stores/postulations";
import {useLoadingStore} from "@/stores/loading";
import FormHeader from "@/components/Registration/Form/Modules/FormHeader.vue";
import VoterCard from "@/components/Registration/Form/Modules/VoterCard.vue";
import {registrationSchema} from "@/components/Registration/Form/Schemas/registration";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useToast} from "@/components/ui/toast";

const store = {storeCompensatory: useCompensatoryStore(), storeGender: useGenresStore(), storePostulation: usePostulationsStore(), storeLoading: useLoadingStore()}

const getCompensatory = computed(() => {
  return store.storeCompensatory.getCompensatory || []
})

const getGenres = computed(() => {
  return store.storeGender.getGenres || []
})

const getPostulations = computed(() => {
  return store.storePostulation.getPostulations || []
})

// Emitir eventos al padre
const emit = defineEmits(["closeModal"]);

// Hook para el Toast
const {toast} = useToast();

// Getting states from API
const loadingStates = ref(false);
const states = ref([]);
const municipalities = ref([]);
const municipalitiesFromResidence = ref([]);
const selectedState = ref(null);
const selectedMunicipality = ref(null);
const selectedStateFromResidence = ref(null);
const selectedMunicipalityFromResidence = ref(null);
const isError = ref({there: false, error: ''});

const fetchStates = async () => {
  loadingStates.value = true;
  store.storeLoading.showLoading()
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
    store.storeLoading.hideLoading()
  }
};

const fetchMunicipalities = async (stateId, field) => {
  store.storeLoading.showLoading()
  try {
    const response = await axios.get(import.meta.env.VITE_SERVICES_API_URI + `municipalities/${stateId}`, {
      headers: {authorization: 'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN}
    });

    console.log("field: ", field);
    field == 1 ? (municipalities.value = response.data.data) : (municipalitiesFromResidence.value = response.data.data);

  } catch (error) {
    console.error('Error al obtener los municipios:', error);
  } finally {
    store.storeLoading.hideLoading()
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
    if (newState) {
      await fetchMunicipalities(newState.id, 2);
    } else {
      municipalitiesFromResidence.value = [];
    }
  });
});

const props = defineProps({
  registration: {
    type: Object,
    required: false
  }
});

const {values, handleSubmit} = useForm({
  validationSchema: toTypedSchema(object().shape(registrationSchema)),
  initialValues: {
    block_id: props.registration?.block?.id,
    registration_id: props.registration?.id,
    postulation_id: props.registration?.postulation?.id,
    position_id: props.registration?.position.id,
  }
});

const onSubmit = handleSubmit(async (values) => {
  try {
    // Evitar que se envíe el formulario si postulation_id y position_id no coinciden con los valores de registration
    if (values.postulation_id !== props.registration.postulation.id || values.position_id !== props.registration.position.id) {
      toast({
        title: "Éxito",
        description: "No se permite cambiar la postulación o el carácter del registro tratándose de una sustitución.",
        variant: 'destructive'
      });

      return;
    }

    await axios.post(import.meta.env.VITE_SIRC_API_URI + `registrations/${props.registration.id}/substitute`, values);

    // Emitir evento al padre para cerrar el modal
    emit("closeModal");

    // Mostrar Toast de éxito
    toast({
      title: "Éxito",
      description: "Registro sustituido correctamente.",
    });
  } catch (error) {
    isError.value = {there: true, error: error.response.data.message};
    console.error('Error al enviar el formulario:', error.response.data.message);
  } finally {
    // Close modal
  }
})

const showCouncilNumber = computed(() => values.postulation_id === 5);
const showMote = computed(() => values.postulation_id === 3 && values.position_id === 1);

</script>

<template>
  <form id="substitution_form" @submit.prevent="onSubmit">

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

    <div class="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
      <div>
        <GeneralInformation/>
      </div>

      <div>
        <VoterCard/>
      </div>
    </div>
    <div class="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
      <div class="border border-slate-400 rounded-md p-4 relative mt-10">
        <FormHeader subtitle="Indique la fecha de nacimiento, además del Estado y Municipio correspondiente" title="Fecha y lugar de nacimiento"/>

        <div class="grid grid-cols-3 gap-4 mt-5">
          <div>
            <FormField v-slot="{ componentField }" name="birthplace.birth">
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <FormControl>
                  <Input type="date" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" v-model="selectedState" name="birthplace.state">
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción">
                        {{ selectedState ? selectedState.name : '' }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-for="state in states" :key="state.id">
                        <SelectItem :value="state">
                          {{ state.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" v-model="selectedMunicipality" :disabled="!selectedState" name="birthplace.municipality">
              <FormItem>
                <FormLabel>Municipio</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción">
                        {{ selectedMunicipality ? selectedMunicipality.name : '' }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-for="municipality in municipalities" :key="municipality.id">
                        <SelectItem :value="municipality">
                          {{ municipality.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>

      <div class="border border-slate-400 rounded-md p-4 relative mt-10">
        <FormHeader subtitle="Información relacionada con el domicilio y el tiempo de residencia" title="Residencia"/>

        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-5">
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <FormField v-slot="{ componentField }" v-model="selectedStateFromResidence" name="residence.state">
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción">
                          {{ selectedStateFromResidence ? selectedStateFromResidence.name : '' }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup v-for="state in states" :key="state.id">
                          <SelectItem :value="state">
                            {{ state.name }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              </FormField>
            </div>
            <div>
              <FormField v-slot="{ componentField }" v-model="selectedMunicipalityFromResidence" :disabled="!selectedStateFromResidence" name="residence.municipality">
                <FormItem>
                  <FormLabel>Municipio</FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una opción"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup v-for="municipality in municipalitiesFromResidence" :key="municipality.id">
                          <SelectItem :value="municipality.name">
                            {{ municipality.name }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              </FormField>
            </div>
          </div>
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <FormField v-slot="{ componentField }" name="residence.city">
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input placeholder="...Victoria de Durango" type="text" v-bind="componentField"/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              </FormField>
            </div>
            <div>
              <FormField v-slot="{ componentField }" name="residence.colony">
                <FormItem>
                  <FormLabel>Colonia/Fraccionamiento</FormLabel>
                  <FormControl>
                    <Input placeholder="...Ciudad Industrial" type="text" v-bind="componentField"/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              </FormField>
            </div>
          </div>
          <div class="sm:col-span-1 md:col-span-2 xl:col-span-2 2xl:col-span-1">
            <FormField v-slot="{ componentField }" name="residence.street">
              <FormItem>
                <FormLabel>Calle</FormLabel>
                <FormControl>
                  <Input placeholder="...Litio" type="text" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-4 mt-5">
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <FormField v-slot="{ componentField }" name="residence.postal_code">
                <FormItem>
                  <FormLabel>Código Postal</FormLabel>
                  <FormControl>
                    <Input v-maska="'#####'" placeholder="34208" type="text" v-bind="componentField"/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              </FormField>
            </div>
            <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4 border border-slate-400 rounded-md p-2">
              <div>
                <FormField v-slot="{ componentField }" name="residence.outside_number">
                  <FormItem>
                    <FormLabel>Número interior</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                </FormField>
              </div>
              <div>
                <FormField v-slot="{ componentField }" name="residence.inside_number">
                  <FormItem>
                    <FormLabel>Número exterior</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                </FormField>
              </div>
              <div class="md:col-span-2 col-span-1 text-gray-500 text-sm">Si su dirección no cuenta con número interior y/o exterior, deje el valor "S/N"</div>
            </div>
          </div>
          <div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            <div>
              <FormField v-slot="{ componentField }" name="residence.length.years">
                <FormItem>
                  <FormLabel>Años</FormLabel>
                  <FormControl>
                    <Input max="99" min="0" type="number" v-bind="componentField"/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              </FormField>
            </div>
            <div>
              <FormField v-slot="{ componentField }" name="residence.length.months">
                <FormItem>
                  <FormLabel>Meses</FormLabel>
                  <FormControl>
                    <Input max="11" min="0" step="1" type="number" v-bind="componentField"/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-cols-1 gap-4">
      <div class="border border-slate-400 rounded-md p-4 relative mt-10">
        <FormHeader subtitle="Ingrese la información referente al cargo por el que se postula" title="Candidatura"/>

        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-5">
          <div>
            <FormField v-slot="{ componentField }" label="Postulación" name="postulation_id">
              <FormItem>
                <FormLabel>Postulación</FormLabel>
                <FormControl>
                  <Select v-bind="componentField" :disabled="true">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-for="postulation in getPostulations" :key="postulation.id">
                        <SelectItem :disabled="!postulation.active" :value="postulation.id">
                          {{ postulation.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div v-show="showCouncilNumber">
            <FormField v-slot="{ componentField }" label="Número de Consejo" name="council_number">
              <FormItem>
                <FormLabel>Posición</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-for="i in registration.block.councils" :key="i">
                        <SelectItem :disabled="!registration?.block?.assignments.includes(i) && registration?.assignments?.length > 0" :value="i">
                          {{ i }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" v-model="position_id" name="position_id">
              <FormItem>
                <FormLabel>Carácter</FormLabel>
                <FormControl>
                  <Select v-bind="componentField" :disabled="true">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem :value="1">
                          Propietaria/o
                        </SelectItem>
                        <SelectItem :value="2">
                          Suplencia/o
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="reelection">
              <FormItem>
                <FormLabel>Periodo de reelección</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Si">
                          Sí (2022-2025)
                        </SelectItem>
                        <SelectItem value="No">
                          No
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="compensatory_id">
              <FormItem>
                <FormLabel>Medida Compensatoria</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-for="compensatory in getCompensatory" :key="compensatory.id">
                        <SelectItem :value="compensatory.id">
                          {{ compensatory.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="gender_id">
              <FormItem>
                <FormLabel>Género</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-for="gender in getGenres" :key="gender.id">
                        <SelectItem :value="gender.id">
                          {{ gender.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div v-show="showMote">
            <FormField v-slot="{ componentField }" name="mote">
              <FormItem>
                <FormLabel>Mote/Sobrenombre</FormLabel>
                <FormControl>
                  <Input placeholder="...Súper Electorín" type="text" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
</style>