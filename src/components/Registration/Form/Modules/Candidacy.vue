<script setup lang="ts">
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {SelectRoot} from "radix-vue";
import {Separator} from "@/components/ui/separator";
import {useSexesStore} from "@/stores/sexes";
import {ref, watch, computed, onMounted} from "vue";

const props = defineProps({
  selectedBlock: {
    type: Object,
    required: true
  },
  form: {
    type: Object,
    required: true
  }
})

const store = {storeSex: useSexesStore()}

const getSexes = computed(() => {
  return store.storeSex.getSexes || []
})

onMounted(() => {
  store.storeSex.fetchSexes()
})

const
    form = computed(() => props.form);
const
    showCouncilNumber = ref(false),
    showSexesSelector = ref(false);

watch(() => props.form.values.postulation_id, (newVal) => {
  showCouncilNumber.value = newVal === '2'; // '2' es el valor para Regiduría
});

watch(() => props.form.values.compensatory_measure, (newVal) => {
  showSexesSelector.value = newVal === "3"; // '3' es el valor para Diversidad sexual
});

</script>

<template>
  <Separator label="Candidatura" class="my-4 font-bold italic"/>
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
                  <SelectItem :value="i.toString()" :disabled="!selectedBlock.assignments?.councils.includes(i) && selectedBlock.assignments?.councils.length > 0">
                    {{ i }}
                    <small class="accent-muted" v-show="!selectedBlock.assignments?.councils.includes(i) && selectedBlock.assignments?.councils.length > 0">(Deshabilitado)</small>
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
    <div :class="showSexesSelector ? 'grid lg:grid-cols-2 grid-cols-1 gap-4' : ''">
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
      <div v-show="showSexesSelector">
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
    </div>
  </div>

</template>

<style scoped>

</style>