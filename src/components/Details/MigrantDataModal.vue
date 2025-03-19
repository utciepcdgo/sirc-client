<script setup lang="ts">
import { DialogRoot } from 'radix-vue';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { number, object, string } from 'yup';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCountriesStore } from '@/stores/countries';
import { computed, onMounted, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast/use-toast';
import { migrantPdf } from '@/components/Documents/functions';
import { currentUnixTime } from '@/components/Documents/utils';
import { Registration } from '@/types/types';
import { IconPdf } from '@tabler/icons-vue';

const store = useCountriesStore();

const getCountries = computed(() => {
  return store.getCountries || [];
});

let isOpen = ref(false);
let setEnableButton = ref(true);

const props = defineProps<{
  registration: Registration;
}>();

onMounted(() => {
  store.fetchCountries();
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object().shape({
      address: string().required('El campo es requerido').min(3).label('Dirección'),
      zip_code: string().required('El campo es requerido').min(3).label('Código Postal'),
      country_id: number().required('El campo es requerido').label('País'),
      registration_id: number().required(),
    }),
  ),
  initialValues: {
    registration_id: props.registration?.id,
    ...props.registration.migrant,
  },
});

const { toast } = useToast();
let initialRegistration = ref<Registration | null>(props.registration);

const onSubmit = handleSubmit(async (values) => {
  await axios.post(import.meta.env.VITE_SIRC_API_URI + 'migrants', values).then(() => {
    toast({
      title: 'Información actualizada correctamente',
      variant: 'default',
    });
  });

  // Retrieve the updated registration object from API
  const response = await axios.get(import.meta.env.VITE_SIRC_API_URI + `registrations/${props.registration.id}`);

  // Update `initialRegistration` with the new data
  initialRegistration.value = response.data.data;

  toast({
    title: 'La información cargada inicialmente ha cambiado',
    variant: 'destructive',
  });

  // Enable the "Generate PDF" button
  setEnableButton.value = false;
});

async function downloadPdf() {
  if (!initialRegistration.value) {
    toast({
      title: 'Error',
      description: 'No hay información para generar el PDF',
      variant: 'destructive',
    });
    return;
  }

  const pdfFormat = await migrantPdf(initialRegistration.value);

  // Create a download link
  const blob = new Blob([pdfFormat], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FORMATO_MIGRANTE' + '_' + currentUnixTime() + '.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

onMounted(() => {
  if (props.registration.migrant) {
    setEnableButton.value = false;
  }
});
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
                  <Input type="text" placeholder="Ingrese dirección completa" v-bind="componentField" />
                </FormControl>
                <FormDescription>Indique la dirección completa en el extranjero</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="zip_code">
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="ZIP Code" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                  Puede que el término sea diferente dependiendo del país, típicamente suele usarse como "Código Zip"
                  (ZIP Code)
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="country_id">
              <FormItem>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Select v-bind="componentField" :default-value="initialRegistration?.migrant?.country?.id.toString()">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-for="country in getCountries" :key="country?.id">
                        <SelectItem :value="country?.id.toString()">
                          {{ country?.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  País seleccionado: {{ initialRegistration?.migrant?.country?.name ?? '(Ninguno)' }}, puede modificar
                  la selección.
                </FormDescription>
              </FormItem>
            </FormField>
          </div>
        </div>
      </form>
      <DialogFooter class="flex items-center !justify-between">
        <div class="space-x-3">
          <Button type="submit" form="migrant_form">Guardar información</Button>
          <Button type="submit" @click="downloadPdf()" :disabled="setEnableButton">
            <IconPdf />
            Generar formato
          </Button>
        </div>
        <DialogClose as-child>
          <Button type="button" variant="secondary">Cerrar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogScrollContent>
  </DialogRoot>
</template>

<style scoped></style>
