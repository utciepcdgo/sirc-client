<script setup lang="ts">

import {DialogRoot} from "radix-vue";
import {DialogDescription, DialogFooter, DialogHeader, DialogScrollContent, DialogTitle, DialogClose} from "@/components/ui/dialog";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {useForm} from "vee-validate";
import {toTypedSchema} from "@vee-validate/yup";
import {number, object, string} from "yup";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useCountriesStore} from "@/stores/countries";
import {computed, onMounted, ref} from "vue";
import {Button} from "@/components/ui/button";
import {useToast} from '@/components/ui/toast/use-toast'
import {migrantPdf} from "@/components/Documents/functions";
import {currentUnixTime} from "@/components/Documents/utils";

const store = useCountriesStore()

const getCountries = computed(() => {
  return store.getCountries || []
})

let isOpen = ref(false)
let setEnableButton = ref(true)

const props = defineProps({
  registration: {
    type: Object,
    required: true
  },
});

onMounted(() => {
  store.fetchCountries()
})

const {values, handleSubmit} = useForm({
  validationSchema: toTypedSchema(object().shape({
    address: string().required('El campo es requerido').min(3).label('Dirección'),
    zip_code: string().required('El campo es requerido').min(3).label('Código Postal'),
    country_id: number().required('El campo es requerido').label('País'),
    registration_id: number().required(),
  })),
  initialValues: {
    registration_id: props.registration?.id,
    ...props.registration.migrant
  }
});

const {toast} = useToast()
let initialRegistration = computed(() => props.registration)

const onSubmit = handleSubmit(async (values) => {
  await axios.post('http://localhost:8000/api/migrants', values).then((res) => {
    toast({
      title: 'Información actualizada correctamente',
      variant: 'default',
    })
  })
  // Retrieve the update registration object from the API and assign to registration prop
  await axios.get(`http://localhost:8000/api/registrations/${props.registration.id}`).then((res) => {
    initialRegistration = res.data.data;
  }).then(() => {
    toast({
      title: 'La información cargada inicialmente ha cambiado',
      variant: 'destructive',
    })
    setEnableButton.value = false
  })
})

async function downloadPdf() {

  const pdfFormat = await migrantPdf(initialRegistration)

  // Create a download link
  const blob = new Blob([pdfFormat], {type: 'application/pdf'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = "FORMATO_MIGRANTE" + '_' + currentUnixTime() + '.pdf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  if (props.registration.migrant) {
    setEnableButton.value = false
  }
})

</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>Domicilio en el extranjero</DialogTitle>
        <DialogDescription>
          Indique el domicilio para {{ registration.name }} {{ registration.first_name }} {{ registration.second_name }}
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="onSubmit" id="migrant_form">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <FormField v-slot="{ componentField }" name="address">
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Ingrese dirección completa" v-bind="componentField"/>
                </FormControl>
                <FormDescription>Indique la dirección completa en el extranjero</FormDescription>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="zip_code">
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="ZIP Code" v-bind="componentField"/>
                </FormControl>
                <FormDescription>Puede que el término sea diferente dependiendo del país, típicamente suele usarse como "Código Zip" (ZIP Code)</FormDescription>
                <FormMessage/>
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="country_id">
              <FormItem>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-for="country in getCountries" :key="country.id">
                        <SelectItem :value="country.id.toString()">
                          {{ country.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
                <FormDescription>País seleccionado: {{ initialRegistration?.migrant?.country?.name ?? "(Ninguno)" }}, use el selector para modificar la selección.</FormDescription>
              </FormItem>
            </FormField>
          </div>
        </div>
      </form>
      <DialogFooter class="flex items-center !justify-between">
        <div class="space-x-3">
          <Button type="submit" form="migrant_form">
            Guardar información
          </Button>
          <Button type="submit" @click="downloadPdf()" :disabled="setEnableButton">
            Generar formato
          </Button>
        </div>
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            Cerrar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogScrollContent>
  </DialogRoot>

</template>

<style scoped>

</style>