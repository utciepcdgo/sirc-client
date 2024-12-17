<script setup lang="ts">
import {FormField, FormItem, FormLabel, FormControl, FormMessage} from '@/components/ui/form';
import {Input} from "@/components/ui/input";

const props = defineProps({
  form: Object
});
</script>

<template>
  <div class="grid lg:grid-cols-4 grid-cols-1 gap-4">
    <div>
      <FormField v-slot="{ componentField }" name="voter_card.cic">
        <FormItem>
          <FormLabel>CIC</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Número a 9 dígitos" v-maska="'#########'" v-bind="componentField"/>
          </FormControl>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
    <div>
      <FormField v-slot="{ componentField }" name="voter_card.ocr">
        <FormItem>
          <FormLabel>OCR</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Número a 13 dígitos" v-maska="'#############'" v-bind="componentField"/>
          </FormControl>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
    <div class="grid lg:grid-cols-2 grid-cols-1 gap-4">
      <div>
        <FormField v-slot="{ componentField }" name="voter_card.section">
          <FormItem>
            <FormLabel>Sección</FormLabel>
            <FormControl>
              <Input type="text" placeholder="4 dígitos" v-maska="'####'" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="voter_card.emission_number">
          <FormItem>
            <FormLabel>Número de emisión</FormLabel>
            <FormControl>
              <Input type="text" placeholder="2 dígitos" v-maska="'##'" v-bind="componentField"/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </div>
    </div>
    <div>
      <FormField v-slot="{ componentField }" name="voter_key">
        <FormItem>
          <FormLabel>Clave de elector</FormLabel>
          <FormControl>
            <Input type="text" placeholder="LLLLLLAAMMDD00H000" v-maska="'@@@@@@########@###'" v-bind="componentField"/>
          </FormControl>
          <FormMessage/>
        </FormItem>
      </FormField>
    </div>
  </div>
</template>

<style scoped>

</style>