<script lang="ts" setup>

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {IconInfoCircle, IconManFilled, IconPlus, IconWomanFilled} from "@tabler/icons-vue";
import TooltipWrapper from "@/components/ui/TooltipWrapper.vue";
import {Button} from "@/components/ui/button";

const props = defineProps({
  block: Object

});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center space-x-2.5">
        <div>
          <img :src="block.municipality.shield" alt="logo" class="w-16 h-16"/>
        </div>
        <div>
          <CardTitle>{{ block.municipality.name }}</CardTitle>
          <CardDescription>
            {{ block.entity.name }}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="flex text-center justify-around">
        <div class="flex flex-col">
          <IconWomanFilled class="self-center"/>
          <small class="text-[8pt]">MUJERES</small>
          <span class="font-bold text-2xl mt-3">{{ block.registrations.stats.women }}</span>
        </div>
        <div class="flex flex-col">
          <IconManFilled class="self-center"/>
          <small class="text-[8pt]">HOMBRES</small>
          <span class="font-bold text-2xl mt-3">{{ block.registrations.stats.man }}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter class="justify-between">
      <div class="flex space-x-2.5 items-center">
        <Button variant="default" @click="openModal(block)">
          <IconPlus stroke-width="3"/>
          Registrar
        </Button>
        <TooltipWrapper message="Vea los registros y gestione la información">
          <Button variant="secondary" @click="openModalDetails(block)">
            <IconInfoCircle/>
            Detalles
          </Button>
        </TooltipWrapper>
      </div>
      <div class="flex items-center">
        <img :alt="block.entity.name" :src="block.entity.logo" class="rounded-full" width="24">
      </div>
    </CardFooter>
  </Card>
</template>

<style scoped>

</style>