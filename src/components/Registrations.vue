<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useBlocksStore } from '@/stores/blocks.js';

import Form from '@/components/Registration/Form.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Input } from '@/components/ui/input';
import type { Block, Registration } from '@/types/types';
import DataTable from './Details/DataTable.vue';
import {
  IconChevronDown,
  IconFilter,
  IconInfoCircle,
  IconManFilled,
  IconPlus,
  IconSearch,
  IconWomanFilled,
  IconXboxXFilled,
} from '@tabler/icons-vue';

import { DialogRoot } from 'radix-vue';
import axios from 'axios';
import { Toaster } from '@/components/ui/toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import TooltipWrapper from '@/components/ui/TooltipWrapper.vue';
import RequestRegistrationModal from '@/components/RequestRegistrationModal.vue';
import ReceiptModal from '@/components/Receipt/ReceiptModal.vue';
import CountDown from '@/components/CountDown.vue';
import { emitBlockDataUpdate } from '@/composables/useBlockData';
import { Alert } from '@/components/ui/alert';

const authStore = useAuthStore();
const loadingStore = useLoadingStore();
const store = useBlocksStore();

const getBlocks = computed(() => {
  return store.getBlocks || [];
});

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      store.fetchBlocks().catch((error) => {
        console.error('Error al obtener los bloques:', error);
      });
    }
  },
  { immediate: true }, // Se ejecuta inmediatamente si `user` ya existe
);

let municipalitySearch = ref('');
const showOnlyWithRegistrations = ref(false);
const showOnlyWithCompensatories = ref(false);
let selectedBlock = ref<Block>(null);
const open = ref<boolean>(false);
const requestRegistrationModal = ref(false);
const openDetails = ref(false);
const blockdata = ref<Block>();
const datatable = ref<Registration[]>([]);

emitBlockDataUpdate.on('updateDatatable', (newData) => {
  datatable.value = newData;
});

const closeModal = () => {
  open.value = false;
};

const openRequestRegistrationModal = () => {
  requestRegistrationModal.value = true;
};

const filterBlocks = computed(() => {
  return getBlocks.value?.filter((block) => {
    const matchesSearch = block?.municipality?.name?.toLowerCase()?.includes(municipalitySearch.value.toLowerCase());
    const hasRegistrations = Number(block?.registrations?.stats?.total) > 0;
    const hasCompensatories = Number(block?.registrations?.stats?.compensatories) > 0;

    if (showOnlyWithRegistrations.value && showOnlyWithCompensatories.value) {
      return matchesSearch && hasRegistrations && hasCompensatories;
    } else if (showOnlyWithRegistrations.value) {
      return matchesSearch && hasRegistrations;
    } else if (showOnlyWithCompensatories.value) {
      return matchesSearch && hasCompensatories;
    } else {
      return matchesSearch;
    }
  });
});

const openModal = (block) => {
  selectedBlock.value = block;
  open.value = true;
};

const openModalDetails = async (block) => {
  loadingStore.showLoading('Obteniendo información del registro...');
  await axios
    .get(import.meta.env.VITE_SIRC_API_URI + `blocks/${block.id}?include=registrations`)
    .then((response) => response)
    .then((response) => {
      blockdata.value = response.data.data;
      datatable.value = blockdata.value?.registrations?.list || [];

      openDetails.value = true;
    })
    .catch((error) => {
      alert('Error al obtener los registros:' + error);
    });
  loadingStore.hideLoading();
};

const currentTime = ref(new Date());

const updateCurrentTime = () => {
  currentTime.value = new Date();
};

let intervalId;

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser();
  }

  await store.fetchBlocks();

  intervalId = setInterval(updateCurrentTime, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="p-6">
    <Toaster />
    <CountDown class="z-10 shadow" />
    <div class="flex justify-between mb-5">
      <div class="relative items-center">
        <div class="flex space-x-3.5">
          <div class="flex-grow">
            <Input
              id="search"
              v-model="municipalitySearch"
              class="pl-10"
              name="search"
              placeholder="Buscar municipio..."
              type="search" />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
              <IconSearch class="size-6 text-muted-foreground" />
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TooltipWrapper message="Filtros">
                <Button variant="link">
                  <IconFilter />
                  <IconChevronDown class="ml-2" />
                </Button>
              </TooltipWrapper>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <div class="flex items-center space-x-2">
                  <Switch id="only-with-compensatories" v-model:checked="showOnlyWithRegistrations" />
                  <div class="flex flex-col">
                    <Label for="only-with-compensatories">Solo registrados</Label>
                    <small>Muestre los municipios con un registro o más.</small>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div class="flex items-center space-x-2">
                  <Switch id="only-with-registrations" v-model:checked="showOnlyWithCompensatories" />
                  <div class="flex flex-col">
                    <Label for="only-with-registrations">Solo Medidas Compensatorias</Label>
                    <small>Muestre los municipios con registros en alguna Medida Compensatoria.</small>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div class="flex items-center space-x-2.5">
        <Button variant="default" @click="openRequestRegistrationModal">
          <IconPlus />
          Crear formato de solicitud de registro
        </Button>
        <ReceiptModal />
      </div>
    </div>

    <RequestRegistrationModal v-model:open="requestRegistrationModal" />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div v-for="block in filterBlocks" :key="block.id">
        <Card class="relative">
          <CardHeader>
            <div class="flex items-center space-x-2.5">
              <div>
                <img :src="block.municipality.shield" alt="logo" class="w-16 h-16" />
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
            <div
              v-if="
                block.assignments.councils !== null &&
                block.assignments.municipality == false &&
                block.assignments.syndic == false &&
                typeof block.assignments.councils === 'object' &&
                block.assignments.councils[0] == 0
              ">
              <Alert variant="destructive">
                <IconXboxXFilled />
                <p>Registro deshabilitado según Convenio</p>
              </Alert>
            </div>
            <div v-else class="flex text-center justify-around">
              <div class="flex flex-col">
                <IconWomanFilled class="self-center" />
                <small class="text-[8pt]">MUJERES</small>
                <span class="font-bold text-2xl mt-3">{{ block.registrations.stats.women }}</span>
              </div>
              <div class="flex flex-col">
                <IconManFilled class="self-center" />
                <small class="text-[8pt]">HOMBRES</small>
                <span class="font-bold text-2xl mt-3">{{ block.registrations.stats.man }}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter class="justify-between">
            <div class="flex space-x-2.5 md:space-x-1 sm:space-x-3.5 lg:space-x-1 xl:space-x-3.5 items-center">
              <Button
                :disabled="
                  block.assignments.councils !== null &&
                  block.assignments.municipality == false &&
                  block.assignments.syndic == false &&
                  typeof block.assignments.councils === 'object' &&
                  block.assignments.councils[0] == 0
                "
                variant="default"
                @click="openModal(block)">
                <IconPlus stroke-width="3" />
                Registrar
              </Button>
              <TooltipWrapper message="Vea los registros y gestione la información">
                <Button variant="secondary" @click="openModalDetails(block)">
                  <IconInfoCircle />
                  Detalles
                </Button>
              </TooltipWrapper>
            </div>
            <div class="flex items-center">
              <img :alt="block.entity.name" :src="block.entity.logo" class="rounded-full" width="24" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>

    <DialogRoot v-model:open="open" :update:open="open">
      <DialogScrollContent class="min-w-fit">
        <DialogHeader>
          <div class="flex items-center space-x-2.5">
            <img
              :alt="'Escudo del municipio de ' + selectedBlock.municipality.name"
              :src="selectedBlock.municipality.shield"
              class="w-16 h-16" />
            <div>
              <DialogTitle>Nuevo registro</DialogTitle>
              <DialogDescription>
                <p>
                  Municipio de
                  {{ selectedBlock.municipality.name }}
                </p>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form :selectedBlock="selectedBlock" @closeModal="closeModal" />
        <DialogFooter class="flex items-center !justify-between">
          <div class="flex items-center space-x-2.5">
            <img :alt="selectedBlock?.entity?.name" :src="selectedBlock?.entity?.logo" class="rounded-md" width="32" />
            <div class="flex flex-col">
              <p class="text-sm">
                {{ selectedBlock?.entity?.name }}
              </p>
              <p class="text-xs text-slate-600">
                {{ currentTime.toLocaleString() }}
              </p>
            </div>
          </div>
          <Button form="registration_form" type="submit">Guardar registro</Button>
        </DialogFooter>
      </DialogScrollContent>
    </DialogRoot>

    <DialogRoot v-model:open="openDetails">
      <DialogScrollContent class="min-w-max">
        <DialogHeader>
          <DialogTitle>Registros en {{ blockdata?.municipality.name }}</DialogTitle>
          <DialogDescription>Revise, edite o sustituya los registros del bloque seleccionado.</DialogDescription>
        </DialogHeader>
        <Tabs default-value="registrations">
          <TabsList>
            <TabsTrigger value="registrations">Registros</TabsTrigger>
            <TabsTrigger value="information">Información adicional</TabsTrigger>
          </TabsList>
          <TabsContent value="registrations">
            <Suspense>
              <DataTable :data="datatable" />
            </Suspense>
          </TabsContent>
          <TabsContent value="information">
            <p>Municipio: {{ blockdata?.municipality.name }}</p>
            <p>Votos obtenidos: {{ blockdata?.votes_obtained }}</p>
            <p>
              Votación válida emitida:
              {{ blockdata?.valid_vote_issued }}
            </p>
            <h5 class="text-md font-bold leading-none tracking-tight my-3">Propiedades</h5>
            <div class="flex flex-col mb-2">
              <span class="font-semibold">Identificador del bloque:</span>
              <span>{{ blockdata?.uuid }}</span>
              <span class="text-gray-600 leading-none text-xs">
                Si tiene algún problema con la información presentada, comparta este identificador al área de soporte.
              </span>
            </div>
            <div class="flex flex-col">
              <span class="font-semibold">Siglados:</span>
              <span class="text-gray-600">
                Presidencia Municipal: {{ blockdata?.assignments?.municipality ? 'Sí' : 'No' }}
              </span>
              <span class="text-gray-600">Sindicatura: {{ blockdata?.assignments?.syndic ? 'Sí' : 'No' }}</span>
              <span class="text-gray-600">Regidurías (Posiciones): {{ blockdata?.assignments?.councils }}</span>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="secondary" @click="openDetails = false">Cerrar ventana</Button>
        </DialogFooter>
      </DialogScrollContent>
    </DialogRoot>
  </div>
</template>

<style scoped></style>
