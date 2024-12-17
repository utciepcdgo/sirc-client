import {z} from "zod";

export const residenceSchema = z.object({
    city: z.string({required_error: 'Requerido'}).min(3).max(255),
    colony: z.string({required_error: 'Requerido'}).min(3).max(255),
    street: z.string({required_error: 'Requerido'}).min(3).max(255),
    postal_code: z.string({required_error: 'Requerido'}).min(3).max(5),
    outside_number: z.string({required_error: 'Requerido'}).min(3).max(255),
    length: z.object({
        years: z.number({required_error: 'Requerido'}).int().min(0)
            .max(99,
                {message: 'El valor máximo permitido es 99'}
            ),
        months: z.number().int().positive().min(0)
            .max(11,
                {message: 'El valor máximo permitido es 11'}
            ),
    })
})