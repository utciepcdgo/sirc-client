<script setup>
import {ref, onMounted, computed} from 'vue'
import {useBlocksStore} from "@/stores/blocks.js";

import Form from "@/components/Registration/Form.vue";

import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {Input} from '@/components/ui/input'

import {
  IconPlus,
  IconWomanFilled,
  IconManFilled,
  IconInfoCircle,
  IconSearch
} from '@tabler/icons-vue';
import {DialogRoot} from "radix-vue";

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

const filterBlocks = computed(() => {
  return getBlocks.value.filter(block => {
    return block.municipality.name.toLowerCase().includes(municipalitySearch.value.toLowerCase())
  })
})

const openModal = (block) => {
  selectedBlock.value = block
  open.value = true
}

</script>

<template>
  <div>
    <div class="relative w-full max-w-sm items-center">
      <Input v-model="municipalitySearch" id="search" type="search" placeholder="Buscar municipio..." class="pl-10"/>
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <IconSearch class="size-6 text-muted-foreground"/>
      </span>
    </div>
  </div>
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
          <div class="flex text-center justify-between">
            <div class="flex flex-col">
              <IconWomanFilled class="self-center"/>
              <small class="text-[8pt]">MUJERES</small>
              <span class="font-bold text-2xl mt-3">{{ block.registrations.stats.women }}</span>
            </div>
            <div class="flex flex-col">
              <IconManFilled class="self-center"/>
              <small class="text-[8pt]">HOMBRES</small>
              <span class="font-bold text-2xl mt-3">{{ block.registrations.stats.mans }}</span>
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
                  <Button variant="secondary">
                    <IconInfoCircle/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Más detalles</p>
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

  <DialogRoot v-model:open="open">
    <DialogContent class="min-w-[50%]">
      <DialogHeader>
        <div class="flex justify-between">
          <div>
            <DialogTitle>Nuevo registro</DialogTitle>
            <DialogDescription>
              Municipio de {{ selectedBlock.municipality.name }}
            </DialogDescription>
          </div>
          <div class="flex flex-col">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Cargo"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cargos</SelectLabel>
                  <SelectItem value="1">
                    Presidencia Municipal
                  </SelectItem>
                  <SelectItem value="2">
                    Sindicatura
                  </SelectItem>
                  <SelectItem value="3">
                    Regiduría
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogHeader>
      <Form />
      <DialogFooter>
        <Button type="submit">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>

  <Label>Test</Label>
  <Button variant="destructive" @click="store.fetchBlocks()">Refresh</Button>
</template>

<style scoped>

</style>