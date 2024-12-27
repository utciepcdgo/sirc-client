<script setup lang="ts">

import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Separator} from "@/components/ui/separator";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";
import {useGenresStore} from "@/stores/genres";

const store = {storeGender: useGenresStore()}

const getGenres = computed(() => {
  return store.storeGender.getGenres || []
})

onMounted(() => {
  store.storeGender.fetchGenres()
})

const [states, municipalities, selectedState, selectedMunicipality, loadingStates, loadingMunicipalities] = [ref(), ref(), ref(null), ref(null), ref(false), ref(false)];

// Obtener los estados al montar el componente
const statesOptions = {
  method: 'GET',
  url: import.meta.env.VITE_SERVICES_API_URI + 'states',
  headers: {authorization: 'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN}
};

onMounted(async () => {
  try {
    loadingStates.value = true;
    const {data} = await axios.request(statesOptions);
    states.value = data.data;
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
</script>

<template>
  <Separator label="Nacimiento" class="my-4 font-bold italic"/>
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
      <FormField v-slot="{ componentField }" name="birthplace.state.value">
        <FormItem>
          <FormLabel>Estado</FormLabel>
          <FormControl>
            <Select v-bind="componentField" v-model="selectedState">
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup v-if="loadingStates">
                  <SelectItem disabled value="-1">Cargando...</SelectItem>
                </SelectGroup>
                <SelectGroup v-else v-for="state in states" :key="state.id">
                  <SelectItem :value="state">
                    {{ state.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription class="text-xs">
            Lugar de nacimiento
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
    <div>
      <FormField v-slot="{ componentField }" name="birthplace.municipality.value" :value-as="Object">
        <FormItem>
          <FormLabel>Municipio</FormLabel>
          <FormControl>
            <Select v-bind="componentField" v-model="selectedMunicipality" :disabled="!selectedState">
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup v-if="loadingMunicipalities">
                  <SelectItem disabled value="-1">Cargando...</SelectItem>
                </SelectGroup>
                <SelectGroup v-else v-for="municipality in municipalities" :key="municipality.id">
                  <SelectItem :value="municipality">
                    {{ municipality.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription class="text-xs">
            Lugar de nacimiento
          </FormDescription>
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
</template>

<style scoped>

</style>