import * as Yup from 'yup';

Yup.setLocale({
  mixed: {
    required: 'El campo ${path} es obligatorio', // Mensaje global
  },
});

export const registrationSchema = Yup.object({
  name: Yup.string().required().min(3).label('Nombre'),
  first_name: Yup.string()
    .required('El primer apellido es obligatorio')
    .test(
      'valid-first_name',
      'Debe tener al menos 3 caracteres o ser "X"',
      (value) => value === 'X' || (value && value.length >= 3),
    )
    .label('Primer apellido'),

  second_name: Yup.string()
    .required('El segundo apellido es obligatorio')
    .test(
      'valid-second_name',
      'Debe tener al menos 3 caracteres o ser "X"',
      (value) => value === 'X' || (value && value.length >= 3),
    )
    .label('Segundo apellido'),
  birthplace: Yup.object().shape({
    birth: Yup.string().required('Este campo es requerido'),
    state: Yup.string().label('Estado').nonNullable('Este campo no puede dejarlo vacío'),
    municipality: Yup.string().label('Municipio').nonNullable('El campo Municipio no puede dejarlo vacío'),
  }),
  residence: Yup.object().shape({
    state: Yup.string().label('Estado').nonNullable('El campo Estado no puede dejarlo vacío'),
    municipality: Yup.string().required().label('Municipio'),
    city: Yup.string().min(3).max(255).required().label('Ciudad'),
    colony: Yup.string().min(3).max(255).required().label('Colonia/Fracc.'),
    street: Yup.string().min(3).max(255).required().label('Calle'),
    postal_code: Yup.string().min(3).max(5).required().label('Código postal'),
    outside_number: Yup.string()
      .matches(/^[a-zA-Z0-9/]*$/)
      .optional()
      .default('S/N')
      .label('Número exterior'),
    inside_number: Yup.string()
      .matches(/^[a-zA-Z0-9/]*$/)
      .optional()
      .default('S/N')
      .label('Número interior'),
    length: Yup.object().shape({
      years: Yup.number().min(0).max(99, 'El valor máximo permitido es 99'),
      months: Yup.number().positive().min(0).max(11, 'El valor máximo permitido es 11'),
    }),
  }),
  occupation: Yup.string().required().min(3).label('Ocupación'),
  voter_key: Yup.string().required().min(18).label('Clave de elector'),
  curp: Yup.string()
    .matches(
      /([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
      {
        message: 'La información no coincide con el formato válido de una CURP',
      },
    )
    .required()
    .label('CURP'),
  voter_card: Yup.object().shape({
    cic: Yup.string()
      .optional()
      .when('$cic', (value, schema) => (value ? schema.min(9, 'Debe tener al menos 11 caracteres') : schema)),
    ocr: Yup.string()
      .optional()
      .when('$ocr', (value, schema) => (value ? schema.min(13, 'Debe tener al menos 13 caracteres') : schema)),
    section: Yup.string()
      .optional()
      .when('$section', (value, schema) => (value ? schema.min(4, 'Debe tener al menos 4 caracteres') : schema)),
    emission_number: Yup.string()
      .optional()
      .when('$emission_number', (value, schema) =>
        value ? schema.min(2, 'Debe tener al menos 2 caracteres') : schema,
      ),
  }),
  postulation_id: Yup.string().required().label('Postulación'),
  position_id: Yup.string().required().label('Carácter'),
  council_number: Yup.string().when('postulation_id', {
    is: '5',
    then: (schema) => schema.required().label('Número de Sindicatura'),
  }),
  reelection: Yup.string().required().label('Reelección'),
  sex_id: Yup.string().required(),
  compensatory_id: Yup.string().required(),
  gender_id: Yup.string().when('compensatory_id', {
    is: (compensatory_id: unknown) => String(compensatory_id) === '3',
    then: (schema) => schema.label('Género').required('El género es obligatorio'),
    otherwise: (schema) => schema.optional().nullable(),
  }),
  mote: Yup.string().optional(),
  id: Yup.number().optional(),
  block_id: Yup.number().optional(),
  registration_id: Yup.number().optional(),
});
