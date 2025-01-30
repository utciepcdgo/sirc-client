<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue'
import {useBlocksStore} from "@/stores/blocks.js";
import {FingerprintSpinner} from 'epic-spinners'

import Form from "@/components/Registration/Form.vue";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {DialogDescription, DialogFooter, DialogHeader, DialogScrollContent, DialogTitle,} from '@/components/ui/dialog'
import {AlertDialog, AlertDialogContent, AlertDialogTitle} from '@/components/ui/alert-dialog'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

import {Input} from '@/components/ui/input'
import type {Registration} from './Details/columns'
import {columns} from './Details/columns'
import DataTable from './Details/DataTable.vue'

import {registrationRequestPdf} from '@/components/Documents/RegistrationRequestPdf';
import {IconChevronDown, IconInfoCircle, IconManFilled, IconPlus, IconRefresh, IconSearch, IconWomanFilled} from '@tabler/icons-vue';

import {DialogRoot, VisuallyHidden} from "radix-vue";
import axios from "axios";
import {Toaster} from "@/components/ui/toast";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore();

const handleLogout = async () => {
  store.isLoading = true
  await authStore.logout().finally(() => {
    store.isLoading = false
  });
};

const store = useBlocksStore()

const getBlocks = computed(() => {
  return store.getBlocks || []
})

// ⏳ Esperar a que `authStore.user` se cargue antes de llamar a `fetchBlocks()`
watch(
    () => authStore.user,
    (newUser) => {
      if (newUser) {
        store.fetchBlocks();
      }
    },
    {immediate: true} // Se ejecuta inmediatamente si `user` ya existe
);

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

async function downloadregistrationRequestPdf(id: number, type: string) {
  // Show a loading spinner while the pdf is being generated
  store.isLoading = true
  // Call the registrationRequestPdf function and pass the entity id as an argument
  await registrationRequestPdf(id, type).finally(() => {
    store.isLoading = false
  })
}

</script>

<template>
  <Toaster/>
  <div>
    <h1>Bienvenido, {{ authStore.user?.name }}</h1>
    <p>Entities: {{ authStore.entities }}</p>
  </div>
  <div class="flex justify-between mb-5">
    <div class="relative w-full max-w-sm items-center">
      <Input id="search" v-model="municipalitySearch" class="pl-10" name="search" placeholder="Buscar municipio..." type="search"/>
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <IconSearch class="size-6 text-muted-foreground"/>
      </span>
    </div>
    <div class="flex items-center space-x-2.5">
      <!--        Generador de formato "Solicitud de registro. El botón acciona un Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="secondary">
            Solicitud de registro
            <IconChevronDown class="ml-2"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem v-for="entity in authStore.entities" :key="entity.id" @click="downloadregistrationRequestPdf(entity.id)">
            {{ entity.name }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="default" @click="store.fetchBlocks()">
        <IconRefresh class="mr-2 h-4 w-4"/>
        Recargar
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="destructive">
            Presentar solicitud de registro
            <IconChevronDown class="ml-2"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="secondary" @click="handleLogout">
        Cerrar sesión
      </Button>
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
          :color="'#ffffff'"
          :size="128"/>
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
                <TooltipContent :align-offset="0" :arrow-padding="0" :collision-boundary="[]" :collision-padding="0" align="center" avoid-collisions hide-when-detached side="top" sticky="partial">
                  <p>Vea los registros y gestione la información</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div class="flex items-center">
            <img :alt="block.entity.name" :src="block.entity.logo" class="rounded-full" width="24">
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>

  <DialogRoot v-model:open="open" :update:open="open">
    <DialogScrollContent class="min-w-[80%]">
      <DialogHeader>
        <div class="flex items-center space-x-2.5">
          <img :alt="'Escudo del municipio de ' + selectedBlock.municipality.name" :src="selectedBlock.municipality.shield" class="w-16 h-16"/>
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
          <img :alt="selectedBlock.entity.name" :src="selectedBlock.entity.logo" class="rounded-md" width="32">
          <div class="flex flex-col">
            <p class="text-sm">{{ selectedBlock.entity.name }}</p>
            <p class="text-xs text-slate-600">{{ currentTime.toLocaleString() }}</p>
          </div>
        </div>
        <Button form="registration_form" type="submit">
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
          <h5 class="text-md font-bold leading-none tracking-tight my-3">Propiedades</h5>
          <div class="flex flex-col mb-2">
            <span class="font-semibold">Identificador del bloque:</span>
            <span>{{ blockdata.uuid }}</span>
            <span class="text-gray-600 leading-none text-xs">Si tiene algún problema con la información presentada, comparta este identificador al área de soporte.</span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold">Siglados:</span>
            <span class="text-gray-600">Presidencia Municipal: {{ blockdata.assignments.municipality ? "Sí" : "No" }}</span>
            <span class="text-gray-600">Sindicatura: {{ blockdata.assignments.syndic ? "Sí" : "No" }}</span>
            <span class="text-gray-600">Regidurías (Posiciones): {{ blockdata.assignments.councils.list }}</span>
          </div>
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <Button variant="secondary" @click="openDetails = false">
          Cerrar ventana
        </Button>
      </DialogFooter>
    </DialogScrollContent>
  </DialogRoot>
</template>

<style scoped>

</style>