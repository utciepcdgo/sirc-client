<script setup lang="ts">
import {FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription} from '@/components/ui/form';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from '@/components/ui/select';
import {ref, watch} from "vue";

const props = defineProps({
  form: Object,
  selectedBlock: Object
});

const showCouncilNumber = ref(false);

watch(() => props.form.values.postulation_id, (newVal) => {
  showCouncilNumber.value = newVal === '2'; // '2' es el valor para Regiduría
});
</script>

<template>
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
                  <SelectItem value="1" :disabled="!selectedBlock.assignments.municipality">
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
    <div v-show="showCouncilNumber">
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
                  <SelectItem :value="i.toString()" :disabled="!selectedBlock.assignments?.councils.list.includes(i) && selectedBlock.assignments?.councils.list.length > 0">
                    {{ i }}
                    <small class="accent-muted" v-show="!selectedBlock.assignments?.councils.list.includes(i) && selectedBlock.assignments?.councils.list.length > 0">(Deshabilitado)</small>
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
      <FormField v-slot="{ componentField }" name="position_id">
        <FormItem>
          <FormLabel>Carácter</FormLabel>
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
                    <SelectItem value="Si">
                      Sí (2022-2025)
                    </SelectItem>
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
    <div>
      <FormField v-slot="{ componentField }" name="compensatory_measure">
        <FormItem>
          <FormLabel>Medida Compensatoria</FormLabel>
          <FormControl>
            <SelectRoot :default-value="'No'">
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción"/>
                </SelectTrigger>
                <SelectContent position="popper" :side-offset="5">
                  <SelectGroup>
                    <SelectItem value="1">
                      Jóven
                    </SelectItem>
                    <SelectItem value="2" aria-selected="true">
                      Discapacidad permanente
                    </SelectItem>
                    <SelectItem value="3" aria-selected="true">
                      Diversidad sexual
                    </SelectItem>
                    <SelectItem value="4" aria-selected="true">
                      Persona adulta mayor
                    </SelectItem>
                    <SelectItem value="5" aria-selected="true">
                      Migrante
                    </SelectItem>
                    <SelectItem value="6" aria-selected="true">
                      Indígena
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
</template>

<style scoped>

</style>