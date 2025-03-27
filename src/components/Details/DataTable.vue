<script lang="ts" setup>
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/vue-table';
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { valueUpdater } from '@/utils/utils';
import { computed, defineProps, h, ref } from 'vue';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Registration } from '@/types/types';
import {
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconArrowsUpDown,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
} from '@tabler/icons-vue';
import DropdownAction from '@/components/Details/DataTableDropDown.vue';
import UploadAction from '@/components/Details/DataTableUploadAction.vue';

const props = defineProps<{
  data: Registration[];
}>();

const pagination = ref({
  pageIndex: 0, // Starts from page 0
  pageSize: 5, // Default rows per page
});

const columns: ColumnDef<Registration>[] = [
  {
    id: 'full_name',
    accessorFn: (row) => `${row?.name} ${row?.first_name} ${row?.second_name}`,
    header: ({ column }) =>
      h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Nombre completo', h(IconArrowsUpDown, { class: 'ml-2 h-4 w-4' })],
      ),
    enableSorting: true,
  },
  // Postulation
  {
    accessorKey: 'postulation',
    header: 'Postulación',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'uppercase' },
        `${row.getValue<Registration>('postulation')?.name ?? 'indefinido'} ${row.original?.postulation.id == '5' ? row.original?.council_number : ''}`,
      ),
    enableHiding: true,
  },
  // Carácter
  {
    accessorKey: 'position',
    header: 'Carácter',
    cell: ({ row }) => h('div', { class: 'uppercase' }, row.getValue<Registration>('position')?.name ?? 'indefinido'),
    enableHiding: true,
  },
  // Sexo
  {
    accessorKey: 'sex',
    header: 'Sexo',
    cell: ({ row }) => h('div', { class: 'uppercase' }, row.getValue<Registration>('sex')?.name ?? 'indefinido'),
    enableHiding: true,
  },
  // Medida compensatoria
  {
    id: 'compensatory',
    accessorKey: 'compensatory',
    header: 'Med. Compensatoria',
    cell: ({ row }) =>
      h('div', { class: 'uppercase' }, row.getValue<Registration>('compensatory')?.name ?? 'indefinido'),
    enableHiding: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => h('div', { class: '' }, row.getValue('status') ?? 'indefinido'),
    enableHiding: true,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const registration = row.original;

      return h(
        'div',
        { class: 'relative' },
        h(DropdownAction, {
          registration: {
            ...registration,
            id: registration.id.valueOf(),
          },
        }),
      );
    },
  },
  {
    id: 'upload',
    enableHiding: false,
    cell: ({ row }) => {
      const registration = row.original;

      return h(
        'div',
        { class: 'relative' },
        h(UploadAction, {
          registration: {
            ...registration,
            id: registration.id.valueOf(),
          },
        }),
      );
    },
  },
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);

const table = useVueTable({
  data: computed(() => props.data),
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get pagination() {
      return pagination.value;
    },
  },
  onPaginationChange: (updater) => {
    pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater;
  },
});
</script>

<template>
  <div>
    <div class="overflow-x-auto">
      <div class="flex justify-end mb-5">
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="search"
            :model-value="table.getColumn('full_name')?.getFilterValue() as string"
            class="pl-10"
            name="search-by-full-name"
            placeholder="Buscar..."
            type="text"
            @update:model-value="table.getColumn('full_name')?.setFilterValue($event)" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <IconSearch class="text-muted-foreground" size="18" />
          </span>
        </div>
      </div>
      <Table class="w-full">
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :props="header.getContext()"
                :render="header.column.columnDef.header" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :props="cell.getContext()" :render="cell.column.columnDef.cell" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">Sin registros 😟</TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <div class="flex items-center justify-between px-2 py-5">
      <div class="flex items-center justify-start space-x-6 lg:space-x-8">
        <div class="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {{ table.getState().pagination.pageIndex + 1 }} de
          {{ table.getPageCount() }}
        </div>
        <div class="flex items-center space-x-2">
          <Button
            :disabled="!table.getCanPreviousPage()"
            class="hidden w-8 h-8 p-0 lg:flex"
            variant="outline"
            @click="table.setPageIndex(0)">
            <span class="sr-only">Ir a la primera página</span>
            <IconArrowBarToLeft class="w-4 h-4" />
          </Button>
          <Button
            :disabled="!table.getCanPreviousPage()"
            class="w-8 h-8 p-0"
            variant="outline"
            @click="table.previousPage()">
            <span class="sr-only">Ir a la página anterior</span>
            <IconChevronLeft class="w-4 h-4" />
          </Button>
          <Button :disabled="!table.getCanNextPage()" class="w-8 h-8 p-0" variant="outline" @click="table.nextPage()">
            <span class="sr-only">Ir a la siguiente página</span>
            <IconChevronRight class="w-4 h-4" />
          </Button>
          <Button
            :disabled="!table.getCanNextPage()"
            class="hidden w-8 h-8 p-0 lg:flex"
            variant="outline"
            @click="table.setPageIndex(table.getPageCount() - 1)">
            <span class="sr-only">Ir a última página</span>
            <IconArrowBarToRight class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
