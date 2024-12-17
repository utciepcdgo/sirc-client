import {z} from "zod";

export const birthPlaceSchema = z.object({
    birth: z.string().date(),
    state: z.union([
        z.object({
            id: z.number().int().positive(),
            name: z.string(),
            abbreviation: z.string(),
            shield: z.string().nullable(),
        }),
        z.undefined()
    ]),
    municipality: z.union([
        z.object({
            id: z.number().int().positive(),
            name: z.string(),
            state_id: z.number().int().positive(),
        }),
        z.undefined()
    ])
})