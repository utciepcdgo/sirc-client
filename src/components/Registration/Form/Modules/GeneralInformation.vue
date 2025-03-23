<script lang="ts" setup>
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { computed, onMounted } from 'vue';
import { useSexesStore } from '@/stores/sexes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Registration } from '@/types/types';

defineProps<{
  registration?: Registration;
}>();

const store = { storeSex: useSexesStore() };

const getSexes = computed(() => {
  return store.storeSex.getSexes || [];
});

onMounted(() => {
  store.storeSex.fetchSexes();
});
</script>

<template>
  <Card class="w-full max-w-full border dark:border-gray-800">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl font-extrabold">Información General</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <FormField v-slot="{ componentField }" name="first_name">
            <FormItem>
              <FormLabel>Primer apellido</FormLabel>
              <FormControl>
                <Input placeholder="Primer apellido" type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="second_name">
            <FormItem>
              <FormLabel>Segundo apellido</FormLabel>
              <FormControl>
                <Input placeholder="Segundo apellido" type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Nombre(s)</FormLabel>
              <FormControl>
                <Input
                  data-maska="Z-Z"
                  data-maska-tokens="Z:[A-Z]:multiple"
                  placeholder="Nombre(s)"
                  type="text"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="occupation">
            <FormItem>
              <FormLabel>Ocupación</FormLabel>
              <FormControl>
                <Input placeholder="Actividad laboral actual" type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="curp">
            <FormItem>
              <FormLabel>CURP</FormLabel>
              <FormControl>
                <Input placeholder="LLLLAAMMDDHDGRLL00" type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="sex_id">
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :default-value="registration?.sex?.id.toString()">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup v-for="sex in getSexes" :key="sex.id">
                      <SelectItem :value="sex.id.toString()">
                        {{ sex.name }}
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
    </CardContent>
  </Card>
</template>

<style scoped></style>
