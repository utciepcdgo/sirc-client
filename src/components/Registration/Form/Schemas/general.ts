import {toTypedSchema} from "@vee-validate/zod";
import {z} from "zod";

// import Schemas for the form validations
import {birthPlaceSchema} from "@/components/Registration/Form/Schemas/birthPlace";
import {residenceSchema} from "@/components/Registration/Form/Schemas/residence";
import {voterCardSchema} from "@/components/Registration/Form/Schemas/voterCard";

export const generalSchema = {
    name: z.string({required_error: 'Requerido'}).min(3, {message: 'Requiere mínimo 3 caracteres.'}).max(50, {message: 'Admite hasta 50 caracteres.'}),
    first_name: z.string({required_error: 'Requerido'}).min(3, {message: 'Requiere mínimo 3 caracteres.'}).max(50, {message: 'Admite hasta 50 caracteres.'}),
    second_name: z.string({required_error: 'Requerido'}).min(3, {message: 'Requiere mínimo 3 caracteres.'}).max(50, {message: 'Admite hasta 50 caracteres.'}),
    birthplace: birthPlaceSchema,
    residence: residenceSchema,
    occupation: z.string({required_error: 'Requerido'}).min(3, {message: 'Requiere mínimo 3 caracteres.'}).max(50),
    voter_key: z.string({required_error: 'Requerido'}).min(18, {message: 'Requiere mínimo 18 caracteres.'}).max(18, {message: 'Requiere hasta 18 caracteres.'}),
    curp: z.string({required_error: 'Requerido'}).regex(/([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/).min(18).max(18).toUpperCase(),
    voter_card: voterCardSchema,
    council_number: z.string(),
    block_id: z.number({required_error: 'Requerido'}).int().positive(),
    position_id: z.string({required_error: 'Seleccione una opción'}).min(1),
    postulation_id: z.string({required_error: 'Seleccione una opción'}).min(1),
    sex_id: z.string({required_error: 'Seleccione una opción'}).min(1),
    gender_id: z.string({required_error: 'Seleccione una opción'}).min(1),
}