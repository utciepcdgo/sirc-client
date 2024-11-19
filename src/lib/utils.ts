import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const RegistrationRoutes: { id: number, title: string, href: string, description: string }[] = [
    {
        id: 1,
        title: "Nuevo registro",
        href: "/registrations/blocks",
        description: "Registra una nueva candidatura para las Presidencias Municipales.",
    },
    {
        id: 2,
        title: "Ver registros",
        href: "/registrations",
        description: "Consulta los registros realizados de candidaturas para las Presidencias Municipales.",
    },
]
