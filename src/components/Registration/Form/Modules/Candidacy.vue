<script lang="ts" setup>
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { computed, onMounted, ref, watch } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCompensatoryStore } from '@/stores/compensatories';
import { useGenresStore } from '@/stores/genres';
import { usePostulationsStore } from '@/stores/postulations';
import { useLoadingStore } from '@/stores/loading';
import { Block } from '@/types/types';
import { registrationSchema } from '@/components/Registration/Form/Schemas/registration';
import { InferType } from 'yup';

const props = defineProps<{
  selectedBlock: Block;
  form: InferType<typeof registrationSchema>;
  mode: string;
}>();

const store = {
  storeCompensatory: useCompensatoryStore(),
  storeGender: useGenresStore(),
  storePostulation: usePostulationsStore(),
  storeLoading: useLoadingStore(),
};

const getCompensatory = computed(() => {
  return store.storeCompensatory.getCompensatory || [];
});

const getGenres = computed(() => {
  return store.storeGender.getGenres || [];
});

const getPostulations = computed(() => {
  return store.storePostulation.getPostulations || [];
});

onMounted(async () => {
  await store.storeCompensatory.fetchCompensatory();
  await store.storeGender.fetchGenres();
  await store.storePostulation.fetchPostulations();
});

const showCouncilField = ref<boolean>(false),
  showGenderSelectorField = ref<boolean>(false),
  showMoteField = ref<boolean>(false);

onMounted(() => {
  // Set showCouncilField, showGenderSelectorField and showMoteField to “true” if the condition is met in an initial state.
  showCouncilField.value = props.form?.postulation_id === '5'; // Muestra el campo para seleccionar la posición de la Regiduría
  showGenderSelectorField.value = props.form?.compensatory_id === '3'; // Muestra el campo para seleccionar el género.
  showMoteField.value = props.form?.postulation_id === '3' && props.form?.position_id === '1'; // Muestra el campo para registrar un sobrenombre.
});

watch(
  () => props.form?.postulation_id,
  (newVal) => {
    showCouncilField.value = newVal === '5';
  },
);

watch(
  () => props.form?.compensatory_id,
  (newVal) => {
    showGenderSelectorField.value = newVal === '3' || props.form?.compensatory_id === '3'; // '3' es el valor para Diversidad sexual
  },
);

watch([() => props.form?.postulation_id, () => props.form?.position_id], ([newPostulationId, newCompensatoryId]) => {
  showMoteField.value =
    (newPostulationId === '3' && newCompensatoryId === '1') ||
    (props.form?.postulation_id === '3' && props.form?.position_id === '1');
});
</script>

<template>
  <Card class="mt-4">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl font-extrabold">Candidatura</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-5">
        <div>
          <FormField v-slot="{ componentField }" label="Postulación" name="postulation_id">
            <FormItem>
              <FormLabel>Postulación</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :disabled="props.mode === 'substitution'">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup v-for="postulation in getPostulations" :key="postulation.id">
                      <SelectItem :disabled="!postulation.active" :value="postulation.id.toString()">
                        {{ postulation.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div v-show="showCouncilField">
          <FormField v-slot="{ componentField }" label="Número de regidor" name="council_number">
            <FormItem>
              <FormLabel>Posición</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :disabled="props.mode === 'substitution'">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup v-for="i in selectedBlock?.municipality?.councils" :key="i">
                      <SelectItem
                        :disabled="
                          !selectedBlock?.assignments?.councils?.includes(i) &&
                          selectedBlock?.assignments?.councils?.length > 0
                        "
                        :value="String(i)">
                        {{ i }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="position_id">
            <FormItem>
              <FormLabel>Carácter</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :disabled="props.mode === 'substitution'">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1">Propietaria/o</SelectItem>
                      <SelectItem value="2">Suplencia/o</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="reelection">
            <FormItem>
              <FormLabel>Periodo de reelección</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Si">Sí (2022-2025)</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="compensatory_id">
            <FormItem>
              <FormLabel>Medida Compensatoria</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup v-for="compensatory in getCompensatory" :key="compensatory.id">
                      <SelectItem :value="compensatory.id">
                        {{ compensatory.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div v-show="showGenderSelectorField">
          <div>
            <FormField v-slot="{ componentField }" name="gender_id">
              <FormItem>
                <FormLabel>Género</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-for="gender in getGenres" :key="gender.id.toString()">
                        <SelectItem :value="gender.id.toString()">
                          {{ gender.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
        <div v-show="showMoteField">
          <FormField v-slot="{ componentField }" name="mote">
            <FormItem>
              <FormLabel>Sobrenombre</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
