<script setup lang="ts">
import {FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription} from '@/components/ui/form';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from '@/components/ui/select';
import {Input} from "@/components/ui/input";

const props = defineProps({
  form: Object,
  states: Array,
  municipalities: Array,
  selectedState: Object,
  selectedMunicipality: Object
});
</script>

<template>
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
      <FormField v-slot="{ componentField }" name="birthplace.state">
        <FormItem>
          <FormLabel>Estado</FormLabel>
          <FormControl>
            <Select v-bind="componentField" v-model="selectedState">
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción"/>
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
          <FormDescription class="text-xs">
            Lugar de nacimiento
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
    <div>
      <FormField v-slot="{ componentField }" name="birthplace.municipality">
        <FormItem>
          <FormLabel>Municipio</FormLabel>
          <FormControl>
            <Select v-bind="componentField" v-model="selectedMunicipality" :disabled="!selectedState">
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción"/>
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
          <FormDescription class="text-xs">
            Lugar de nacimiento
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
  </div>
</template>

<style scoped>

</style>