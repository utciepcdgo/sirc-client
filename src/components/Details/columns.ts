import {h} from 'vue'
import DropdownAction from './DataTableDropDown.vue'
import UploadAction from './DataTableUploadAction.vue'
import {IconArrowsUpDown} from '@tabler/icons-vue'
import {Button} from '@/components/ui/button'

export const columns: ColumnDef<Registration>[] = [
    {
        accessorKey: 'name',
        header: ({column}) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Nombre', h(IconArrowsUpDown, {class: 'ml-2 h-4 w-4'})])
        },
        cell: ({row}) => h('div', {class: 'uppercase'}, row.getValue('name')),
        sortingFn: 'alphanumeric'
    },
    {
        accessorKey: 'first_name',
        header: () => h('div', 'Primero apellido'),
        cell: ({row}) => h('div', row.getValue('first_name').toUpperCase()),
    },
    {
        accessorKey: 'second_name',
        header: () => h('div', 'Segundo apellido'),
        cell: ({row}) => h('div', row.getValue('second_name').toUpperCase()),
    },
    {
        accessorKey: 'position',
        header: () => h('div', 'Cargo'),
        cell: ({row}) => h('div', row.getValue('position').name.toUpperCase()),
    },
    {
        accessorKey: 'postulation',
        header: () => h('div', 'Postulación'),
        cell: ({row}) => h('div', row.getValue('postulation').name.toUpperCase()),
    },
    {
        accessorKey: 'sex',
        header: () => h('div', 'Sexo'),
        cell: ({row}) => h('div', row.getValue('sex').name.toUpperCase()),
    },
    {
        accessorKey: 'compensatory',
        header: () => h('div', 'Med. Compensatoria'),
        cell: ({row}) => h('div', row.getValue('compensatory').name.toUpperCase()),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({row}) => {
            const registration = row.original

            return h('div', {class: 'relative'}, h(DropdownAction, {
                registration,
            }))
        }
    },
    {
        id: 'upload',
        enableHiding: false,
        cell: ({row}) => {
            const registration = row.original

            return h('div', {class: 'relative'}, h(UploadAction, {
                registration,
            }))
        }
    }
]


export interface Registration {
    id: string
    uuid: string
    name: string
    first_name: string
    second_name: string,
    block: {
        id: string
        municipality: string
    },
    position: {
        id: string
        name: string
    },
    postulation: {
        id: string
        name: string
    },
    sex: {
        id: string
        name: string
    },
    compensatory: {
        id: string
        name: string
    },
    gender?: {
        id: string
        name: string
    }
}