<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed} from 'vue'
import {useBlocksStore} from "@/stores/blocks.js";
import {FingerprintSpinner} from 'epic-spinners'

import Form from "@/components/Registration/Form.vue";

import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {DialogScrollContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog'
import {AlertDialog, AlertDialogContent, AlertDialogTitle} from '@/components/ui/alert-dialog'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

import {Input} from '@/components/ui/input'
import type {Registration} from './Details/columns'
import {columns} from './Details/columns'
import DataTable from './Details/DataTable.vue'


import {
  IconPlus,
  IconWomanFilled,
  IconManFilled,
  IconInfoCircle,
  IconSearch
} from '@tabler/icons-vue';

import {DialogRoot, VisuallyHidden} from "radix-vue";
import axios from "axios";

const store = useBlocksStore()

const getBlocks = computed(() => {
  return store.getBlocks || []
})

onMounted(() => {
  store.fetchBlocks()
})

let municipalitySearch = ref('')
let selectedBlock = ref(null)
let open = ref(false)
let openDetails = ref(false)
const blockdata = ref(null)
const datatable = ref<Registration[]>([])

const filterBlocks = computed(() => {
  return getBlocks.value.filter(block => {
    return block.municipality.name.toLowerCase().includes(municipalitySearch.value.toLowerCase())
  })
})

const openModal = (block) => {
  selectedBlock.value = block
  open.value = true
}

const openModalDetails = async (block) => {
  // Get all registrations from the selected block through the API using axios
  // and show them in a modal
  store.isLoading = true
  console.log('block: ', block.id)
  try {
    const response = await axios.get(import.meta.env.VITE_SIRC_API_URI + `blocks/${block.id}?include=registrations`)
    blockdata.value = response.data.data
    datatable.value<Registration> = blockdata.value.registrations.list
  } catch (error) {
    console.error('Error al obtener los registros:', error)
  } finally {
    store.isLoading = false
    openDetails.value = true
  }
  console.log('blockData', blockdata)
}

const currentTime = ref(new Date());

const updateCurrentTime = () => {
  currentTime.value = new Date();
};

let intervalId;

onMounted(() => {
  intervalId = setInterval(updateCurrentTime, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

</script>

<template>
  <div>
    <div class="relative w-full max-w-sm items-center">
      <Input v-model="municipalitySearch" id="search" type="search" name="search" placeholder="Buscar municipio..." class="pl-10"/>
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <IconSearch class="size-6 text-muted-foreground"/>
      </span>
    </div>
  </div>
  <!--  SHOW ALERT LOADING FEED -->
  <AlertDialog v-model:open="store.isLoading">
    <AlertDialogContent class="w-[177.6px] bg-transparent border-0 shadow-none">
      <VisuallyHidden>
        <AlertDialogTitle>Cargando...</AlertDialogTitle>
      </VisuallyHidden>
      <fingerprint-spinner
          :animation-duration="1500"
          :size="128"
          :color="'#ffffff'"/>
      <p class="text-center font-bold text-white">Cargando...</p>
    </AlertDialogContent>
  </AlertDialog>

  <AlertDialog v-model:open="store.blocksError">
    <AlertDialogContent class="min-w-[128]">
      <VisuallyHidden asChild>
        <AlertDialogTitle>Error</AlertDialogTitle>
      </VisuallyHidden>
      <p>Hubo un error al intentar cargar el contenido, contacte al administrador.</p>
      <p class="mt-3 text-sm p-0 leading-none">Detalles:</p>
      <small class="italic text-red-600 leading-none">{{ store.blocksError }}</small>
    </AlertDialogContent>
  </AlertDialog>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    <div v-for="(block) in filterBlocks" :key="block.id">
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
            <TooltipProvider :delay-duration="100">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button variant="secondary" @click="openModalDetails(block)">
                    <IconInfoCircle/>
                    Detalles
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="center" :align-offset="0" :arrow-padding="0" avoid-collisions :collision-boundary="[]" :collision-padding="0" hide-when-detached side="top" sticky="partial">
                  <p>Vea los registros y gestione la información</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div class="flex items-center">
            <img :src="block.entity.logo" :alt="block.entity.name" class="rounded-full" width="24">
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>

  <DialogRoot v-model:open="open" @close-registration-modal="open = false">
    <DialogScrollContent class="min-w-[80%]">
      <DialogHeader>
        <div class="flex items-center space-x-2.5">
          <img :src="selectedBlock.municipality.shield" :alt="'Escudo del municipio de ' + selectedBlock.municipality.name" class="w-16 h-16"/>
          <div>
            <DialogTitle>Nuevo registro</DialogTitle>
            <DialogDescription>
              <p>Municipio de {{ selectedBlock.municipality.name }}</p>
            </DialogDescription>
            Bloque seleccionado: {{ selectedBlock.id }}
          </div>
        </div>
      </DialogHeader>
      <Form :selectedBlock="selectedBlock"/>
      <DialogFooter class="flex items-center !justify-between">
        <div class="flex items-center space-x-2.5">
          <img :src="selectedBlock.entity.logo" :alt="selectedBlock.entity.name" class="rounded-md" width="32">
          <div class="flex flex-col">
            <p class="text-sm">{{ selectedBlock.entity.name }}</p>
            <p class="text-xs text-slate-600">{{ currentTime.toLocaleString() }}</p>
          </div>
        </div>
        <Button type="submit" form="registration_form">
          Guardar registro
        </Button>
      </DialogFooter>
    </DialogScrollContent>
  </DialogRoot>

  <DialogRoot v-model:open="openDetails">
    <DialogScrollContent class="min-w-[80%]">
      <DialogHeader>
        <DialogTitle>Registros en {{ blockdata.municipality.name }}</DialogTitle>
        <DialogDescription>
          Revise, edite o sustituya los registros del bloque seleccionado.
        </DialogDescription>
      </DialogHeader>
      <Tabs default-value="registrations">
        <TabsList>
          <TabsTrigger value="registrations">
            Registros
          </TabsTrigger>
          <TabsTrigger value="information">
            Información adicional
          </TabsTrigger>
        </TabsList>
        <TabsContent value="registrations">
          <DataTable :columns="columns" :data="datatable"/>
        </TabsContent>
        <TabsContent value="information">
          <p>Municipio: {{ blockdata.municipality.name }}</p>
          <p>Votos obtenidos: {{ blockdata.votes_obtained }}</p>
          <p>Votación válida emitida: {{ blockdata.valid_vote_issued }}</p>
          <h5 class="text-md font-semibold leading-none tracking-tight my-3">Propiedades</h5>
          <div class="flex flex-col">
            <span>Identificador del bloque: {{ blockdata.uuid }}</span>
            <span class="text-gray-600 leading-none text-xs">Si tiene algún problema con la información presentada, comparta este identificador al área de soporte.</span>
          </div>
        </TabsContent>
      </Tabs>
    </DialogScrollContent>
  </DialogRoot>

  <Label>Test</Label>
  <Button variant="destructive" @click="store.fetchBlocks()">Refresh</Button>
</template>

<style scoped>

</style>