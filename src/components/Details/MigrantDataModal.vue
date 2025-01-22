<script setup lang="ts">

import {DialogRoot, VisuallyHidden} from "radix-vue";
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
import {AlertDialog, AlertDialogContent, AlertDialogTitle} from "@/components/ui/alert-dialog";
import {FingerprintSpinner} from "epic-spinners";
import {Button} from "@/components/ui/button";

const store = useCountriesStore()

const getCountries = computed(() => {
  return store.getCountries || []
})

let isOpen = ref(false)
let setOpen = ref(false)

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
    address: string().required().min(3),
    zip_code: string().required().min(3),
    country_id: number().required(),
    registration_id: number().required(),
  })),
  initialValues: {
    registration_id: props.registration?.id,
  }
});

const onSubmit = handleSubmit(async (values) => {
    await axios.post('http://localhost:8000/api/migrants', values)
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
              </FormItem>
            </FormField>
          </div>
        </div>
      </form>
      <DialogFooter class="flex items-center !justify-between">
        <Button type="submit" form="migrant_form">
          Guardar información
        </Button>
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