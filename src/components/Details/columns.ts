import {h} from 'vue'
import DropdownAction from './DataTableDropDown.vue'

export const columns: ColumnDef<Registration>[] = [
    {
        accessorKey: 'name',
        header: () => h('div', 'Nombre'),
        cell: ({row}) => h('div', row.getValue('name')),
    },
    {
        accessorKey: 'first_name',
        header: () => h('div', 'Primero apellido'),
        cell: ({row}) => h('div', row.getValue('first_name')),
    },
    {
        accessorKey: 'second_name',
        header: () => h('div', 'Segundo apellido'),
        cell: ({row}) => h('div', row.getValue('second_name')),
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
        accessorKey: 'compensatory',
        header: () => h('div', 'Med. Compensatoria'),
        cell: ({row}) => h('div', row.getValue('compensatory').name),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({row}) => {
            const registration = row.original

            return h('div', { class: 'relative' }, h(DropdownAction, {
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