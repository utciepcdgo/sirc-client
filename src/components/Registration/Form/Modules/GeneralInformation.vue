<script setup lang="ts">
import {FormField, FormItem, FormLabel, FormControl, FormMessage} from '@/components/ui/form';
import {Input} from "@/components/ui/input";

const props = defineProps({
  form: Object
});
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div>
      <FormField v-slot="{ componentField }" name="first_name">
        <FormItem>
          <FormLabel>Primer apellido</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Primer apellido" v-bind="componentField"/>
          </FormControl>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
    <div>
      <FormField v-slot="{ componentField }" name="second_name">
        <FormItem>
          <FormLabel>Segundo apellido</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Segundo apellido" v-bind="componentField"/>
          </FormControl>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
    <div>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Nombre(s)</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Nombre(s)" v-bind="componentField"/>
          </FormControl>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
    <div>
      <FormField v-slot="{ componentField }" name="occupation">
        <FormItem>
          <FormLabel>Ocupación</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Actividad laboral actual" v-bind="componentField"/>
          </FormControl>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
    <div>
      <FormField v-slot="{ componentField }" name="curp">
        <FormItem>
          <FormLabel>CURP</FormLabel>
          <FormControl>
            <Input type="text" placeholder="LLLLAAMMDDHDGRLL00" v-maska="'@@@@######@@@@@@##'" v-bind="componentField"/>
          </FormControl>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
  </div>
</template>

<style scoped>

</style>