<script setup lang="ts">

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {vMaska} from "maska/vue"

</script>

<template>
  <div class="grid sm:grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
    <div class="grid grid-cols-2 gap-4">
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
    </div>
    <div>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Nombre(s)</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Nombre(s)" data-maska="Z-Z" data-maska-tokens="Z:[A-Z]:multiple" v-bind="componentField"/>
          </FormControl>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
  </div>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
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