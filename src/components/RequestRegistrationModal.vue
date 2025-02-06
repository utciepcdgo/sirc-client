<script lang="ts" setup>

import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogScrollContent, DialogTitle} from "@/components/ui/dialog";
import {computed, onMounted, reactive, ref} from 'vue';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'; // Ajusta las importaciones según tu proyecto
import {Input} from '@/components/ui/input'
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {useToast} from "@/components/ui/toast";
import {DialogRoot} from "radix-vue";
import {IconMinus, IconPlus} from "@tabler/icons-vue";
import TooltipWrapper from "@/components/ui/TooltipWrapper.vue";
import {useLoadingStore} from "@/stores/loading";
import {useAuthStore} from "@/stores/auth";
import axios from "axios";

let setEnableButton = ref(false)
const loading = useLoadingStore()
const authStore = useAuthStore();
const {toast} = useToast()

// Declaramos un objeto reactivo con los valores iniciales del formulario
// Inicialmente se registra una sola persona
const formData = reactive({
  persons: [
    {
      name: '',
      ownership: ''
    }
  ]
});


// Creamos un ref para acceder a la instancia del <Form>
const formRef = ref(null);

/**
 * Función para agregar una persona.
 * Se utiliza el método setValues del Form para actualizar el array de personas.
 */
function handleAddPerson() {
  if (formRef.value) {
    // Obtenemos el estado actual del formulario
    const current = formRef.value.values;
    if (current.persons.length < 2) {
      // Actualizamos el array de personas agregando una nueva entrada
      formRef.value.setValues({
        persons: [...current.persons, { name: '', ownership: '' }]
      });
    }
  }
}

/**
 * Función para eliminar la última persona.
 */
function handleRemovePerson() {
  if (formRef.value) {
    const current = formRef.value.values;
    if (current.persons.length > 1) {
      formRef.value.setValues({
        persons: current.persons.slice(0, current.persons.length - 1)
      });
    }
  }
}

// Función que se ejecuta al enviar el formulario
// Aquí se arma el payload final, agregando "entity_id" a cada objeto
function onSubmit(values) {
  const payload = values.persons.map(person => ({
    ...person,
    entity_id: 4
  }));
  console.log('Payload enviado:', payload);

  // Mostramos pantalla de carga
  loading.showLoading();
  // Ejemplo de envío a la API (descomenta y ajusta según tu endpoint)
  axios.post(import.meta.env.VITE_SIRC_API_URI + 'representatives', payload)
      .then(response => {
        // Ocultamos pantalla de carga
        loading.hideLoading()
        // Mostramos mensaje de éxito
        toast({
          title: 'Información guardada correctamente',
          variant: 'default',
        });
      })
      .catch(error => {
        console.error(error)
        loading.hideLoading()
        toast({
          title: 'Ocurrió un error al guardar la información',
          variant: 'destructive',
        });
      });
}

onMounted(() => {
  // Primero se obtiene la información de la API a través del endpoint /representatives?entity_id=4
  // Luego se asigna la información al objeto formData
  loading.showLoading();
  console.log("Usuario autenticado: ", authStore?.user?.entities[0].id)
  axios.get(import.meta.env.VITE_SIRC_API_URI + 'representatives?entity_id=' + authStore?.user?.entities[0]?.id)
      .then(response => {
        // Se asigna la información al objeto formData
        formData.persons = response.data.data
        loading.hideLoading()
        console.log('Información obtenida:', response.data.data);
      })
      .catch(error => {
        console.error(error)
        toast({
          title: 'Ocurrió un error al obtener la información',
          variant: 'destructive',
        });
        loading.hideLoading()
      });
  // Ejemplo de cómo habilitar/deshabilitar el botón de "Generar formato"
  // Se deshabilita si no hay al menos un nombre y un puesto
  setEnableButton = ref(formData.persons.some(person => person.name && person.ownership))
})

</script>

<template>
  <DialogRoot>
    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>Formato de Solicitud de Registro</DialogTitle>
        <DialogDescription>
          Proporcione la información de quienes suscriben al presente formato.
        </DialogDescription>
      </DialogHeader>
      <Form ref="formRef" id="request_format_form" v-slot="{ values, setValues }" :initial-values="formData" @submit="onSubmit">
        <!-- Recorremos el array de personas (values.persons) -->
        <div
            v-for="(person, index) in values.persons"
            :key="index"
            class="mb-6 border-b pb-4"
        >
          <h3 class="text-lg font-bold mb-2">Persona {{ index + 1 }}</h3>

          <!-- Campo Nombre -->
          <FormField v-slot="{ field, meta }" :name="`persons.${index}.name`">
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre" v-bind="field"/>
              </FormControl>
              <FormMessage v-if="meta.touched && meta.error"/>
            </FormItem>
          </FormField>

          <!-- Campo Puesto (Ownership) -->
          <FormField v-slot="{ field, meta }" :name="`persons.${index}.ownership`">
            <FormItem>
              <FormLabel>Puesto</FormLabel>
              <FormControl>
                <!-- Componente Select con dos opciones -->
                <Select v-bind="field" :default-value="person?.ownership">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Representante Propietario">
                        Representante Propietario
                      </SelectItem>
                      <SelectItem value="Representante Suplente">
                        Representante Suplente
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage v-if="meta.touched && meta.error"/>
            </FormItem>
          </FormField>
        </div>

        <!-- Botón para agregar una segunda persona (solo si hay menos de 2 personas) -->
        <div v-if="values.persons.length < 2" class="mb-6">
          <TooltipWrapper message="Agregar segunda persona">
            <Button type="button" variant="secondary" @click="handleAddPerson(setValues, values)">
              <IconPlus/>
            </Button>
          </TooltipWrapper>
        </div>

        <!-- Botón para eliminar una persona (visible solo cuando hay 2 personas) -->
        <div v-if="values.persons.length === 2" class="mb-6">
          <TooltipWrapper message="Remover segunda persona">
            <Button type="button" variant="destructive" @click="handleRemovePerson(setValues, values)">
              <IconMinus/>
            </Button>
          </TooltipWrapper>
        </div>
      </Form>
      <DialogFooter class="flex items-center !justify-between">
        <div class="space-x-3">
          <Button form="request_format_form" type="submit">
            Guardar información
          </Button>
          <Button :disabled="setEnableButton" type="submit" @click="downloadPdf()">
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