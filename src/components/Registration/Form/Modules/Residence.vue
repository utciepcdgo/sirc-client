<script setup lang="ts">

import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {vMaska} from "maska/vue";
</script>

<template>
  <Separator label="Residencia" class="my-4 font-bold italic"/>
  <div class="grid grid-cols-3 gap-4">
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="col-span-1 lg:col-span-2">
          <FormField v-slot="{ componentField }" name="residence.street">
            <FormItem>
              <FormLabel>Calle</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Especifique únicamente la calle" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="residence.outside_number">
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Número ext." v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="col-span-1 lg:col-span-2">
          <FormField v-slot="{ componentField }" name="residence.colony">
            <FormItem>
              <FormLabel>Colonia</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Col./Fracc./Priv./Loc." v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="residence.postal_code">
            <FormItem>
              <FormLabel>Código Postal</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Número a 5 dígitos" v-maska="'#####'" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <FormField v-slot="{ componentField }" name="residence.city">
          <FormItem>
            <FormLabel>Ciudad</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Ciudad" v-bind="componentField"/>
            </FormControl>
            <FormDescription class="text-xs">
              P.e. Victoria de Durango
            </FormDescription>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="residence.length.years">
          <FormItem>
            <FormLabel>Años</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0" v-maska="'##'" v-bind="componentField"/>
            </FormControl>
            <FormDescription class="text-xs">
              Años de residencia
            </FormDescription>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="residence.length.months">
          <FormItem>
            <FormLabel>Meses</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0" v-maska="'##'" v-bind="componentField"/>
            </FormControl>
            <FormDescription class="text-xs">
              Meses de residencia
            </FormDescription>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>