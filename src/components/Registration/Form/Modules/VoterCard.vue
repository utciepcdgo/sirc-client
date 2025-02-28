<script lang="ts" setup>
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {vMaska} from "maska/vue"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import TooltipWrapper from "@/components/ui/TooltipWrapper.vue";
import {IconInfoCircle} from "@tabler/icons-vue";
import PopoverWrapper from "@/components/ui/PopoverWrapper.vue";
</script>

<template>
  <Card class="w-full max-w-full border dark:border-gray-800">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl font-extrabold">Credencial para Votar</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <FormField v-slot="{ componentField }" name="voter_card.cic">
            <FormItem>
              <FormLabel class="flex items-center justify-between">
                <span>CIC</span>
                <PopoverWrapper :message="`<img src='https://s3.us-east-1.amazonaws.com/static.appsiepcdurango.mx/Miselaneo/INE_B_CIC_OCR.png'  alt='Reverso de Credencial para votar'/>`">
                  <TooltipWrapper message="Haga clic para ver información acerca de cómo localizar el código CIC en la Credencial para Votar">
                    <IconInfoCircle class="w-4 h-4 text-blue-400"/>
                  </TooltipWrapper>
                </PopoverWrapper>
              </FormLabel>
              <FormControl>
                <Input v-maska="'#########'" placeholder="Código CIC" type="text" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="voter_card.ocr">
            <FormItem>
              <FormLabel class="flex items-center justify-between">
                <span>OCR</span>
                <PopoverWrapper :message="`<img src='https://s3.us-east-1.amazonaws.com/static.appsiepcdurango.mx/Miselaneo/INE_B_CIC_OCR.png' alt='Reverso de Credencial para votar'/>`">
                  <TooltipWrapper message="Haga clic para ver información acerca de cómo localizar el código OCR en la Credencial para Votar">
                    <IconInfoCircle class="w-4 h-4 text-blue-400"/>
                  </TooltipWrapper>
                </PopoverWrapper>
              </FormLabel>
              <FormControl>
                <Input v-maska="'#############'" placeholder="Código CIC" type="text" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="voter_card.section">
            <FormItem>
              <FormLabel>Sección</FormLabel>
              <FormControl>
                <Input v-maska="'####'" placeholder="0298" type="text" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="voter_card.emission_number" label="Año de emisión">
            <FormItem>
              <FormLabel>Año de emisión</FormLabel>
              <FormControl>
                <Input v-maska="'####'" placeholder="Año de emisión" type="text" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="voter_key">
            <FormItem>
              <FormLabel>Clave de Elector</FormLabel>
              <FormControl>
                <Input v-maska="'@@@@@@########@###'" placeholder="LLLLLL00000000L000" type="text" v-bind="componentField"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>