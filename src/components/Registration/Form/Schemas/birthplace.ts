import {z} from "zod";
import {transform} from "radix-vue/dist/Pagination/utils";

export const birthPlaceSchema = z.object({
    birth: z.string().date(),
    state: z.object({
        id: z.number().int().positive(),
        name: z.string(),
        abbreviation: z.string(),
        shield: z.string().nullable(),
    }).transform((value) => JSON.stringify(value)),
    municipality: z.object({
        id: z.number().int().positive(),
        name: z.string(),
        state_id: z.number().int().positive(),
    }).transform((value) => JSON.stringify(value))
})