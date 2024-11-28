<script setup lang="ts">
import {Input} from "@/components/ui/input";
import {toTypedSchema} from '@vee-validate/zod';
import {Separator} from "@/components/ui/separator";

import {useGenresStore} from "@/stores/genres.js";
import {useSexesStore} from "@/stores/sexes.js";

import {vMaska} from "maska/vue"

import {z} from 'zod';
import {useForm} from "vee-validate";

const props = defineProps({
  selectedBlock: {
    type: Object,
    required: true
  }
});

import {IconStarFilled} from "@tabler/icons-vue"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel, SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";

import {SelectRoot} from "radix-vue";

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
  place: z.string().min(3).max(255),
})

const formSchema = toTypedSchema(z.object({
  name: z.string({required_error: 'Requerido'}).min(3).max(255),
  first_name: z.string({required_error: 'Requerido'}).min(3).max(255),
  second_name: z.string({required_error: 'Requerido'}).min(3).max(255),
  birthplace: birthPlaceSchema,
  residence: residenceSchema,
  occupation: z.string({required_error: 'Requerido'}).min(3).max(255),
  voter_key: z.string({required_error: 'Requerido'}).min(18).max(18),
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
</script>

<template>
  <form @submit.prevent="onSubmit" id="registration_form">
    <Input type="hidden" name="block_id" v-bind="componentField"/>
    <div class="grid grid-cols-3 gap-4">
      <div>
        <FormField v-slot="{ componentField }" name="first_name">
          <FormItem>
            <FormLabel>Primer apellido</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Primer apellido" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="second_name">
          <FormItem>
            <FormLabel>Segundo apellido</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Segundo apellido" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Nombre(s)</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Nombre(s)" data-maska="Z-Z" data-maska-tokens="Z:[A-Z]:multiple" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
    </div>

    <Separator label="Nacimiento" class="my-4"/>
    <div class="grid grid-cols-4 gap-4">
      <div>
        <FormField v-slot="{ componentField }" name="birthplace.birth">
          <FormItem>
            <FormLabel>Fecha de nacimiento</FormLabel>
            <FormControl>
              <Input type="date" placeholder="Fecha de nacimiento" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="birthplace.place">
          <FormItem>
            <FormLabel>País de origen</FormLabel>
            <FormControl>
              <Input type="text" placeholder="País de origen" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="sex_id">
          <FormItem>
            <FormLabel>Identidad Sexual</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup v-for="(sex) in getSexes" :key="sex.id">
                    <SelectItem :value="sex.id">
                      {{ sex.name }}
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
                  <SelectGroup v-for="(genre) in getGenres" :key="genre.id">
                    <SelectItem :value="genre.id">
                      {{ genre.name }}
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

    <Separator label="Información general" class="my-4"/>
    <div class="grid grid-cols-3 gap-4">
      <div>
        <FormField v-slot="{ componentField }" name="occupation">
          <FormItem>
            <FormLabel>Ocupación</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Actividad laboral actual" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="curp">
          <FormItem>
            <FormLabel>CURP</FormLabel>
            <FormControl>
              <Input type="text" placeholder="LLLLAAMMDDHDGRLL00" v-maska="'@@@@######@@@@@@##'" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
    </div>

    <Separator label="Residencia" class="my-4"/>
    <div class="grid grid-cols-3 gap-4">
      <div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="col-span-1 lg:col-span-2">
            <FormField v-slot="{ componentField }" name="residence.street">
              <FormItem>
                <FormLabel>Calle</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Especifique únicamente la calle" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="residence.outside_number">
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Número ext." v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>
      <div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="col-span-1 lg:col-span-2">
            <FormField v-slot="{ componentField }" name="residence.colony">
              <FormItem>
                <FormLabel>Colonia</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Col./Fracc./Priv./Loc." v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="residence.postal_code">
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Número a 5 dígitos" v-maska="'#####'" v-bind="componentField"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <FormField v-slot="{ componentField }" name="residence.city">
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Ciudad" v-bind="componentField"/>
              </FormControl>
              <FormDescription class="text-xs">
                P.e. Victoria de Durango
              </FormDescription>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="residence.length.years">
            <FormItem>
              <FormLabel>Años</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" v-maska="'##'" v-bind="componentField"/>
              </FormControl>
              <FormDescription class="text-xs">
                Años de residencia
              </FormDescription>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="residence.length.months">
            <FormItem>
              <FormLabel>Meses</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" v-bind="componentField"/>
              </FormControl>
              <FormDescription class="text-xs">
                Meses de residencia
              </FormDescription>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>

    <Separator label="Credencial para Votar" class="my-4"/>
    <div class="grid lg:grid-cols-4 grid-cols-1 gap-4">
      <div>
        <FormField v-slot="{ componentField }" name="voter_card.cic">
          <FormItem>
            <FormLabel>CIC</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Número a 9 dígitos" v-maska="'#########'" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="voter_card.ocr">
          <FormItem>
            <FormLabel>OCR</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Número a 13 dígitos" v-maska="'#############'" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div class="grid lg:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <FormField v-slot="{ componentField }" name="voter_card.section">
            <FormItem>
              <FormLabel>Sección</FormLabel>
              <FormControl>
                <Input type="text" placeholder="4 dígitos" v-maska="'####'" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="voter_card.emission_number">
            <FormItem>
              <FormLabel>Numero de emisión</FormLabel>
              <FormControl>
                <Input type="text" placeholder="2 dígitos" v-maska="'##'" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="voter_key">
          <FormItem>
            <FormLabel>Clave de elector</FormLabel>
            <FormControl>
              <Input type="text" placeholder="LLLLLLAAMMDD00H000" v-maska="'@@@@@@########@###'" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
    </div>

    <Separator label="Cargo" class="my-4"/>
    <div class="grid lg:grid-cols-4 grid-cols-1 gap-4">
      <div>
        <FormField v-slot="{ componentField }" name="postulation_id">
          <FormItem>
            <FormLabel>Postulado a:</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">
                      Presidencia Municipal
                    </SelectItem>
                    <SelectItem value="2">
                      Regiduría
                    </SelectItem>
                    <SelectItem value="3">
                      Sindicatura
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div v-if="showCouncilNumber">
        <FormField v-slot="{ componentField }" name="council_number">
          <FormItem>
            <FormLabel>Posición</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup v-for="i in selectedBlock.municipality.councils" :key="i">
                    <SelectItem :value="i.toString()">{{ i }}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="position_id">
          <FormItem>
            <FormLabel>Cargo</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">
                      Propietaria/o
                    </SelectItem>
                    <SelectItem value="2">
                      Suplencia
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
            <FormLabel>Reelección</FormLabel>
            <FormControl>
              <SelectRoot :default-value="'No'">
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción"/>
                  </SelectTrigger>
                  <SelectContent position="popper" :side-offset="5">
                    <SelectGroup>
                      <SelectItem value="2022-2025">
                        2022-2025
                      </SelectItem>
                      <SelectItem value="2019-2022">
                        2019-2022
                      </SelectItem>
                      <SelectItem value="2016-2019">
                        2016-2019
                      </SelectItem>
                      <SelectSeparator />
                      <SelectItem value="No" aria-selected="true">
                        No
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </SelectRoot>
            </FormControl>
            <FormDescription class="text-xs">
              Periodo de reelección.
            </FormDescription>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
    </div>
  </form>
</template>

<style scoped>

</style>