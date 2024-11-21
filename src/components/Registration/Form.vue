<script setup lang="ts">
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toTypedSchema} from '@vee-validate/zod';
import {Separator} from "@/components/ui/separator";

import {useGenresStore} from "@/stores/genres.js";
import {useSexesStore} from "@/stores/sexes.js";

import { vMaska } from "maska/vue"

import {z} from 'zod';
import {useForm} from "vee-validate";

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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {computed, onMounted} from "vue";

const voterCardSchema = z.object({
  cic: z.number().min(1).max(999),
  ocr: z.number().min(1).max(999),
  section: '',
  emission_number: '',
});

const addressLengthResidenceSchema = z.object({
  city: z.string().min(3).max(255),
  colony: z.string().min(3).max(255),
  street: z.string().min(3).max(255),
  country: z.string().min(3).max(255),
  latitude: z.string().min(3).max(255),
  longitude: z.string().min(3).max(255),
  outside_number: z.string().min(3).max(255),
})

const formSchema = toTypedSchema({
  name: 'string',
  first_name: 'string',
  last_name: 'string',
  second_name: 'string',
  birthplace: 'string',
  address_length_residence: addressLengthResidenceSchema,
  occupation: 'string',
  voter_key: z.string().regex(/^[A-Z]{6}[0-9]{8}[A-Z]{1}[0-9]{3}$/, {message: "No es una clave de elector válida"}),
  curp: z.string().regex(/^([A-Z][AEIOUX][A-Z]{2}\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\\d])(\\d)$/, {message: "No es una CURP válida"}),
  voter_card: voterCardSchema,
  block_id: 'number',
  position_id: 'string',
  postulation_id: 'string',
  sex_id: 'string',
  gender_id: 'string',
});

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values)
})

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

</script>

<template>
  <form @submit="onSubmit">
    <div class="grid grid-cols-3 gap-4">
      <div>
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Nombre(s)" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
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
    </div>
    <Separator label="Nacimiento" class="my-4"/>
    <div class="grid grid-cols-4 gap-4">
      <div>
        <FormField v-slot="{ componentField }" name="birth">
          <FormItem>
            <FormLabel>Fecha</FormLabel>
            <FormControl>
              <Input type="date" placeholder="shadcn" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="place">
          <FormItem>
            <FormLabel>País</FormLabel>
            <FormControl>
              <Input type="text" placeholder="País" v-bind="componentField" value="México"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="place">
          <FormItem>
            <FormLabel>Sexo</FormLabel>
            <FormControl>
              <Select>
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
        <FormField v-slot="{ componentField }" name="place">
          <FormItem>
            <FormLabel>Género</FormLabel>
            <FormControl>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup v-for="(genre, i) in getGenres" :key="genre.id">
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

    <Separator label="Residencia" class="my-4"/>
    <div class="grid grid-cols-3 gap-4">
      <div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="col-span-1 lg:col-span-2">
            <FormField v-slot="{ componentField }" name="street">
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
            <FormField v-slot="{ componentField }" name="outside_number">
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
        <FormField v-slot="{ componentField }" name="colony">
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
        <FormField v-slot="{ componentField }" name="city">
          <FormItem>
            <FormLabel>Ciudad</FormLabel>
            <FormControl>
              <Input type="text" placeholder="País" v-bind="componentField"/>
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
              <Input type="text" placeholder="Especifique únicamente la calle" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="voter_key">
          <FormItem>
            <FormLabel>Clave de elector</FormLabel>
            <FormControl>
              <Input type="text" placeholder="LLLLLLAAMMDD00H000" data-maska="AAAAAA########A###" data-maska-tokens="{ 'A': { 'pattern': '[A-Z]' }}" v-bind="componentField"/>
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

    <Button type="submit">
      Submit
    </Button>
  </form>
</template>

<style scoped>

</style>