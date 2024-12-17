import {z} from "zod";

export const voterCardSchema = z.object({
    cic: z.string({required_error: 'Requerido'}).min(9).max(9).optional(),
    ocr: z.string({required_error: 'Requerido'}).min(13).max(13).optional(),
    section: z.string({required_error: 'Requerido'}).min(1).max(4).optional(),
    emission_number: z.string({required_error: 'Requerido'}).min(1).max(99).optional(),
});