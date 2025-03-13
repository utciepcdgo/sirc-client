<script lang="ts" setup>
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import VoterCard from '@/components/Registration/Form/Modules/VoterCard.vue';
import FormHeader from '@/components/Registration/Form/Modules/FormHeader.vue';
import GeneralInformation from '@/components/Registration/Form/Modules/GeneralInformation.vue';
import { Input } from '@/components/ui/input';
import { computed, onMounted, ref, watch } from 'vue';
import { useCompensatoryStore } from '@/stores/compensatories';
import { useGenresStore } from '@/stores/genres';
import { useLoadingStore } from '@/stores/loading';
import { usePostulationsStore } from '@/stores/postulations';
import { useBlocksStore } from '@/stores/blocks';
import { registrationSchema } from '@/components/Registration/Form/Schemas/registration';
import { vMaska } from 'maska/vue';
import axios, { AxiosRequestConfig } from 'axios';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object } from 'yup';
import { useToast } from '@/components/ui/toast';
import { Registration, State, Municipality } from '@/types/types';

// Hook para el Toast
const { toast } = useToast();

const props = defineProps<{ registration?: Registration }>();

const store = {
	storeCompensatory: useCompensatoryStore(),
	storeGender: useGenresStore(),
	storePostulation: usePostulationsStore(),
	storeLoading: useLoadingStore(),
	storeBlocks: useBlocksStore(),
};

const getCompensatory = computed(() => {
	return store.storeCompensatory.getCompensatory || [];
});

const getGenres = computed(() => {
	return store.storeGender.getGenres || [];
});

const getPostulations = computed(() => {
	return store.storePostulation.getPostulations || [];
});

// Emitir eventos al padre
const emit = defineEmits(['closeEditionModal']);

const states = ref<State[]>([]);
const municipalities = ref<Municipality[]>([]);
const municipalitiesFromResidence = ref([]);
const selectedState = ref<State>(
	props.registration?.birthplace?.state ??
		<State>{
			id: 0,
			name: 'Desconocido',
			abbreviation: 'Desconocido',
			shield: 'Desconocido',
		}
);
const selectedMunicipality = ref<Municipality>(
	props.registration?.birthplace.municipality ??
		<Municipality>{ id: 0, name: 'Desconocido', state_id: 0 }
);
const selectedStateFromResidence = ref<State>(
	props.registration?.residence?.state ??
		<State>{
			id: 0,
			name: 'Desconocido',
			abbreviation: 'Desconocido',
			shield: 'Desconocido',
		}
);
const selectedMunicipalityFromResidence = ref<String>(
	props.registration?.residence?.municipality ?? 'Desconocido'
);

const fetchStates = async () => {
	store.storeLoading.showLoading();
	try {
		const response = await axios.get(
			import.meta.env.VITE_SERVICES_API_URI + 'states',
			{
				headers: {
					authorization:
						'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN,
				},
			} as AxiosRequestConfig
		);
		states.value = response.data.data;
		console.log(states.value);
	} catch (error) {
		console.error(error);
	} finally {
		store.storeLoading.hideLoading();
	}
};

const fetchMunicipalities = async (stateId: number, field: number) => {
	store.storeLoading.showLoading();
	try {
		const response = await axios.get(
			import.meta.env.VITE_SERVICES_API_URI + `municipalities/${stateId}`,
			{
				headers: {
					authorization:
						'Bearer ' + import.meta.env.VITE_SERVICES_API_TOKEN,
				},
			} as AxiosRequestConfig
		);

		console.log('field: ', field);
		field == 1
			? (municipalities.value = response.data.data)
			: (municipalitiesFromResidence.value = response.data.data);
	} catch (error) {
		console.error('Error al obtener los municipios:', error);
	} finally {
		store.storeLoading.hideLoading();
	}
};

onMounted(async () => {
	await store.storeCompensatory.fetchCompensatory();
	await store.storeGender.fetchGenres();
	await store.storePostulation.fetchPostulations();

	await fetchStates();

	// Field 1 is for birthplace
	watch(
		selectedState,
		async (newState: State) => {
			console.log(selectedState.value);
			if (newState) {
				await fetchMunicipalities(newState.id, 1);
			} else {
				municipalities.value = [];
			}
		},
		{ flush: 'post' }
	);

	// Field 2 is for residence
	watch(selectedStateFromResidence, async (newState: State) => {
		if (newState) {
			await fetchMunicipalities(newState.id, 2);
		} else {
			municipalitiesFromResidence.value = [];
		}
	});
});

const { handleSubmit } = useForm<Registration>({
	validationSchema: toTypedSchema(object().shape(registrationSchema)),
	initialValues: {
		name: props.registration?.name,
		first_name: props.registration?.first_name,
		second_name: props.registration?.second_name,
		birthplace: {
			birth: props.registration?.birthplace?.birth,
		},
		residence: {
			city: props.registration?.residence.city,
			colony: props.registration?.residence.colony,
			street: props.registration?.residence.street,
			postal_code: props.registration?.residence.postal_code,
			outside_number: props.registration?.residence.outside_number,
			inside_number: props.registration?.residence.inside_number,
			length: {
				years: props.registration?.residence.length.years,
				months: props.registration?.residence.length.months,
			},
		},
		occupation: props.registration?.occupation,
		voter_key: props.registration?.voter_key,
		curp: props.registration?.curp,
		postulation_id: props.registration?.postulation.id,
		position_id: props.registration?.position.id,
		reelection: props.registration?.reelection,
		compensatory_id: props.registration?.compensatory.id,
		sex_id: props.registration?.sex.id,
		block_id: props.registration?.block.id,
		gender_id: props.registration?.gender.id,
		mote: props.registration?.mote,
	},
});

const onSubmit = handleSubmit(async (values) => {
	try {
		await axios.patch(
			`http://localhost:8000/api/registrations/${props.registration?.id}`,
			values
		);

		// Emitir evento al padre para cerrar el modal
		emit('closeEditionModal');

		// Mostrar Toast de éxito
		toast({
			title: 'Éxito',
			description: 'Registro actualizado correctamente.',
		});
		await store.storeBlocks.fetchBlocks();
	} catch (error) {
		console.error('Error al enviar el formulario:', error);
	}
});

const showCouncilNumber = computed(
	() => useForm()?.values?.postulation_id === 5
);
const showMote = computed(() => {
	const postulationId = useForm()?.values?.postulation_id ?? 0;
	const positionId = useForm()?.values?.position_id ?? 0;
	const registrationPostulationId = props.registration?.postulation.id ?? 0;
	const registrationPositionId = props.registration?.position.id ?? 0;

	return (
		(postulationId === 3 && positionId === 1) ||
		(registrationPostulationId === 4 && registrationPositionId === 1)
	);
});
</script>

<template>
	<form id="edition_form" @submit.prevent="onSubmit">
		{{ showMote }}
		<div class="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
			<div>
				<GeneralInformation :registration="registration" />
			</div>

			<div>
				<VoterCard />
			</div>
		</div>
		<div class="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
			<div class="border border-slate-400 rounded-md p-4 relative mt-10">
				<FormHeader
					subtitle="Indique la fecha de nacimiento, además del Estado y Municipio correspondiente"
					title="Fecha y lugar de nacimiento" />

				<div class="grid grid-cols-3 gap-4 mt-5">
					<div>
						<FormField
							v-slot="{ componentField }"
							name="birthplace.birth">
							<FormItem>
								<FormLabel>Fecha de nacimiento</FormLabel>
								<FormControl>
									<Input
										:default-value="
											registration?.birthplace?.birth
										"
										type="date"
										v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
					<div>
						<FormField
							v-slot="{ componentField }"
							v-model="selectedState"
							name="birthplace.state">
							<FormItem>
								<FormLabel>Estado</FormLabel>
								<FormControl>
									<Select v-bind="componentField">
										<SelectTrigger>
											<SelectValue
												placeholder="Selec0cione una opción">
												{{
													selectedState
														? selectedState?.name
														: ''
												}}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectGroup
												v-for="state in states"
												:key="state?.id">
												<SelectItem
													:value="state.toString()">
													{{ state?.name }}
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
					<div>
						<FormField
							v-slot="{ componentField }"
							v-model="selectedMunicipality"
							:disabled="!selectedState"
							name="birthplace.municipality">
							<FormItem>
								<FormLabel>Municipio</FormLabel>
								<FormControl>
									<Select v-bind="componentField">
										<SelectTrigger>
											<SelectValue
												placeholder="Seleccione una opción">
												{{
													selectedMunicipality
														? selectedMunicipality?.name
														: ''
												}}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectGroup
												v-for="municipality in municipalities"
												:key="municipality.id">
												<SelectItem
													:value="
														municipality.toString()
													">
													{{ municipality.name }}
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
				</div>
			</div>

			<div class="border border-slate-400 rounded-md p-4 relative mt-10">
				<FormHeader
					subtitle="Información relacionada con el domicilio y el tiempo de residencia"
					title="Residencia" />

				<div
					class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-5">
					<div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
						<div>
							<FormField
								v-slot="{ componentField }"
								v-model="selectedStateFromResidence"
								name="residence.state">
								<FormItem>
									<FormLabel>Estado</FormLabel>
									<FormControl>
										<Select v-bind="componentField">
											<SelectTrigger>
												<SelectValue
													placeholder="Seleccione una opción">
													{{
														selectedStateFromResidence
															? selectedStateFromResidence.name
															: ''
													}}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectGroup
													v-for="state in states"
													:key="state.id">
													<SelectItem
														:value="
															state.toString()
														">
														{{ state.name }}
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>
						<div>
							<FormField
								v-slot="{ componentField }"
								v-model="selectedMunicipalityFromResidence"
								:disabled="!selectedStateFromResidence"
								name="residence.municipality">
								<FormItem>
									<FormLabel>Municipio</FormLabel>
									<FormControl>
										<Select v-bind="componentField">
											<SelectTrigger>
												<SelectValue
													placeholder="Seleccione una opción">
													{{
														selectedMunicipalityFromResidence
															? selectedMunicipalityFromResidence
															: ''
													}}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectGroup
													v-for="municipality in municipalitiesFromResidence"
													:key="municipality.name">
													<SelectItem
														:value="
															municipality.name
														">
														{{ municipality.name }}
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>
					</div>
					<div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
						<div>
							<FormField
								v-slot="{ componentField }"
								name="residence.city">
								<FormItem>
									<FormLabel>Ciudad</FormLabel>
									<FormControl>
										<Input
											placeholder="...Victoria de Durango"
											type="text"
											v-bind="componentField" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>
						<div>
							<FormField
								v-slot="{ componentField }"
								name="residence.colony">
								<FormItem>
									<FormLabel
										>Colonia/Fraccionamiento</FormLabel
									>
									<FormControl>
										<Input
											placeholder="...Ciudad Industrial"
											type="text"
											v-bind="componentField" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>
					</div>
					<div
						class="sm:col-span-1 md:col-span-2 xl:col-span-2 2xl:col-span-1">
						<FormField
							v-slot="{ componentField }"
							name="residence.street">
							<FormItem>
								<FormLabel>Calle</FormLabel>
								<FormControl>
									<Input
										placeholder="...Litio"
										type="text"
										v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
				</div>
				<div
					class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-4 mt-5">
					<div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
						<div>
							<FormField
								v-slot="{ componentField }"
								name="residence.postal_code">
								<FormItem>
									<FormLabel>Código Postal</FormLabel>
									<FormControl>
										<Input
											v-maska="'#####'"
											placeholder="34208"
											type="text"
											v-bind="componentField" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>
						<div
							class="grid grid-cols-1 2xl:grid-cols-2 gap-4 border border-slate-400 rounded-md p-2">
							<div>
								<FormField
									v-slot="{ componentField }"
									name="residence.inside_number">
									<FormItem>
										<FormLabel>Número exterior</FormLabel>
										<FormControl>
											<Input
												type="text"
												v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
							</div>
							<div>
								<FormField
									v-slot="{ componentField }"
									name="residence.outside_number">
									<FormItem>
										<FormLabel>Número interior</FormLabel>
										<FormControl>
											<Input
												type="text"
												v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>
							</div>
							<div
								class="md:col-span-2 col-span-1 text-gray-500 text-sm">
								Si su dirección no cuenta con número interior
								y/o exterior, deje el valor "S/N"
							</div>
						</div>
					</div>
					<div class="grid grid-cols-1 2xl:grid-cols-2 gap-4">
						<div>
							<FormField
								v-slot="{ componentField }"
								name="residence.length.years">
								<FormItem>
									<FormLabel>Años</FormLabel>
									<FormControl>
										<Input
											max="99"
											min="0"
											type="number"
											v-bind="componentField" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>
						<div>
							<FormField
								v-slot="{ componentField }"
								name="residence.length.months">
								<FormItem>
									<FormLabel>Meses</FormLabel>
									<FormControl>
										<Input
											max="11"
											min="0"
											step="1"
											type="number"
											v-bind="componentField" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="grid-cols-1 gap-4">
			<div class="border border-slate-400 rounded-md p-4 relative mt-10">
				<FormHeader
					subtitle="Ingrese la información referente al cargo por el que se postula"
					title="Candidatura" />

				<div
					class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-5">
					<div>
						<FormField
							v-slot="{ componentField }"
							label="Postulación"
							name="postulation_id">
							<FormItem>
								<FormLabel>Postulación</FormLabel>
								<FormControl>
									<Select
										:default-value="
											props.registration?.postulation.id.toString()
										"
										v-bind="componentField">
										<SelectTrigger>
											<SelectValue
												placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup
												v-for="postulation in getPostulations?.data"
												:key="postulation.id">
												<SelectItem
													:disabled="
														!postulation.active
													"
													:value="postulation.id">
													{{ postulation.name }}
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
					<div v-show="showCouncilNumber">
						<FormField
							v-slot="{ componentField }"
							label="Número de Consejo"
							name="council_number">
							<FormItem>
								<FormLabel>Posición</FormLabel>
								<FormControl>
									<Select v-bind="componentField">
										<SelectTrigger>
											<SelectValue
												placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup
												v-for="i in props.registration
													?.block.assignments
													.councils"
												:key="i">
												<SelectItem
													:disabled="
														!props.registration?.block.assignments.councils?.includes(
															i
														) &&
														registration?.block
															?.assignments
															?.councils?.length >
															0
													"
													:value="i">
													{{ i }}
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
					<div>
						<FormField
							v-slot="{ componentField }"
							v-model="position_id"
							name="position_id">
							<FormItem>
								<FormLabel>Carácter</FormLabel>
								<FormControl>
									<Select
										:default-value="
											props.registration?.position.id.toString()
										"
										v-bind="componentField">
										<SelectTrigger>
											<SelectValue
												placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem :value="String(1)">
													Propietaria/o
												</SelectItem>
												<SelectItem :value="String(2)">
													Suplencia/o
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
					<div>
						<FormField
							v-slot="{ componentField }"
							name="reelection">
							<FormItem>
								<FormLabel>Periodo de reelección</FormLabel>
								<FormControl>
									<Select
										:default-value="
											registration?.reelection
										"
										v-bind="componentField">
										<SelectTrigger>
											<SelectValue
												placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="Si">
													Sí (2022-2025)
												</SelectItem>
												<SelectItem value="No">
													No
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
					<div>
						<FormField
							v-slot="{ componentField }"
							name="compensatory_id">
							<FormItem>
								<FormLabel>Medida Compensatoria</FormLabel>
								<FormControl>
									<Select
										:default-value="
											props.registration?.compensatory.id.toString()
										"
										v-bind="componentField">
										<SelectTrigger>
											<SelectValue
												placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup
												v-for="compensatory in getCompensatory"
												:key="compensatory.id">
												<SelectItem
													:value="
														compensatory.id.toString()
													">
													{{ compensatory.name }}
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
					<div>
						<FormField v-slot="{ componentField }" name="gender_id">
							<FormItem>
								<FormLabel>Género</FormLabel>
								<FormControl>
									<Select
										:default-value="
											registration?.gender?.id.toString()
										"
										v-bind="componentField">
										<SelectTrigger>
											<SelectValue
												placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup
												v-for="gender in getGenres"
												:key="gender.id">
												<SelectItem
													:value="
														gender.id.toString()
													">
													{{ gender.name }}
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
					<div v-show="showMote">
						<FormField v-slot="{ componentField }" name="mote">
							<FormItem>
								<FormLabel>Mote/Sobrenombre</FormLabel>
								<FormControl>
									<Input
										placeholder="...Súper Electorín"
										type="text"
										v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>

<style scoped></style>
