<script setup lang="ts">
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {vMaska} from "maska/vue"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
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