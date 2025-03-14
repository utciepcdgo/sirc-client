import * as Yup from 'yup';
import axios from 'axios';

Yup.setLocale({
	mixed: {
		required: 'El campo ${path} es obligatorio', // Mensaje global
	},
});

export const registrationSchema = {
	name: Yup.string().required().min(3).label('Nombre'),
	first_name: Yup.string().required().min(3).label('Primer apellido'),
	second_name: Yup.string().required().min(3).label('Segundo apellido'),
	birthplace: Yup.object().shape({
		birth: Yup.date().required('Este campo es requerido'),
		state: Yup.string()
			.label('Estado')
			.nonNullable('Este campo no puede dejarlo vacío'),
		municipality: Yup.string()
			.label('Municipio')
			.nonNullable('El campo Municipio no puede dejarlo vacío'),
	}),
	residence: Yup.object().shape({
		state: Yup.string()
			.label('Estado')
			.nonNullable('El campo Estado no puede dejarlo vacío'),
		municipality: Yup.string()
			.min(3)
			.max(255)
			.required()
			.label('Municipio'),
		city: Yup.string().min(3).max(255).required().label('Ciudad'),
		colony: Yup.string().min(3).max(255).required().label('Colonia/Fracc.'),
		street: Yup.string().min(3).max(255).required().label('Calle'),
		postal_code: Yup.string()
			.min(3)
			.max(5)
			.required()
			.label('Código postal'),
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
			years: Yup.number()
				.min(0)
				.max(99, 'El valor máximo permitido es 99'),
			months: Yup.number()
				.positive()
				.min(0)
				.max(11, 'El valor máximo permitido es 11'),
		}),
	}),
	occupation: Yup.string().required().min(3).label('Ocupación'),
	voter_key: Yup.string().required().min(18).label('Clave de elector'),
	curp: Yup.string()
		.matches(
			/([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
			{
				message:
					'La información no coincide con el formato válido de una CURP',
			}
		)
		.required()
		.label('CURP'),
	voter_card: Yup.object().shape({
		cic: Yup.string()
			.min(9, 'Debe ingresar 9 caracteres numéricos')
			.max(9)
			.optional(),
		ocr: Yup.string()
			.min(13, 'Debe ingresar 13 caracteres numéricos')
			.max(13)
			.optional(),
		section: Yup.string().min(1).max(4).optional(),
		emission_number: Yup.string()
			.optional()
			.min(2, 'El valor mínimo permitido es 2')
			.max(2, 'El valor máximo permitido es 2')
			.label('Número de emisión'),
	}),
	postulation_id: Yup.number().required().label('Postulación'),
	position_id: Yup.number().required().label('Carácter'),
	council_number: Yup.string().when('postulation_id', {
		is: 5, // ✅ Se requiere solo si postulation_id === 3
		then: (schema) => schema.required().label('Número de Sindicatura'),
	}),
	reelection: Yup.string().required().label('Reelección'),
	sex_id: Yup.number().required(),
	compensatory_id: Yup.number().required(),
	gender_id: Yup.number().when('compensatory_id', {
		is: (compensatory_id) => {
			return compensatory_id === 3;
		},
		then: (s) => s.label('Género').required(),
		otherwise: (s) => s,
	}),
	mote: Yup.string().optional(),
	id: Yup.number().optional(),
};

export const fetchStates = async () => {
	try {
		const response = await axios.get(
			import.meta.env.VITE_SERVICES_API_URI + 'states',
			{
				headers: {
					authorization:
						'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN,
				},
			}
		);
		return response.data.data;
	} catch (error) {
		console.error(error);
		return null;
	} finally {
	}
};

export const fetchMunicipalities = async (stateId: number) => {
	try {
		const response = await axios.get(
			import.meta.env.VITE_SERVICES_API_URI + `municipalities/${stateId}`,
			{
				headers: {
					authorization:
						'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN,
				},
			}
		);
		return response.data.data;
	} catch (error) {
		console.error('Error al obtener los municipios:', error);
	} finally {
	}
};
