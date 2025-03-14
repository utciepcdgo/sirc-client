<script lang="ts" setup>
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { computed, onMounted, ref, watch } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCompensatoryStore } from '@/stores/compensatories';
import { useGenresStore } from '@/stores/genres';
import { usePostulationsStore } from '@/stores/postulations';
import { useLoadingStore } from '@/stores/loading';

const props = defineProps({
	selectedBlock: {
		type: Object,
		required: false,
	},
	form: {
		type: Object,
		required: false,
	},
});

const store = {
	storeCompensatory: useCompensatoryStore(),
	storeGender: useGenresStore(),
	storePostulation: usePostulationsStore(),
	storeLoading: useLoadingStore(),
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

onMounted(async () => {
	await store.storeCompensatory.fetchCompensatory();
	await store.storeGender.fetchGenres();
	await store.storePostulation.fetchPostulations();
});

const form = computed(() => props.form);
const showCouncilNumber = ref(false),
	showSexesSelector = ref(false);

watch(
	() => props.form.postulation_id,
	(newVal) => {
		showCouncilNumber.value = newVal === '2'; // '2' es el valor para Regiduría
	}
);

watch(
	() => props.form.compensatory_measure,
	(newVal) => {
		showSexesSelector.value = newVal === '3'; // '3' es el valor para Diversidad sexual
	}
);
</script>

<template>
	<Card class="mt-4">
		<CardHeader class="text-center">
			<CardTitle class="text-2xl font-extrabold">Candidatura</CardTitle>
		</CardHeader>
		<CardContent>
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
								<Select v-bind="componentField">
									<SelectTrigger>
										<SelectValue
											placeholder="Seleccione una opción" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup
											v-for="postulation in getPostulations.data"
											:key="postulation.id">
											<SelectItem
												:disabled="!postulation.active"
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
											v-for="i in selectedBlock
												?.municipality?.councils"
											:key="i">
											<SelectItem
												:disabled="
													!selectedBlock?.assignments?.councils?.includes(
														i
													) &&
													selectedBlock?.assignments
														?.councils?.length > 0
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
								<Select v-bind="componentField">
									<SelectTrigger>
										<SelectValue
											placeholder="Seleccione una opción" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem :value="1">
												Propietaria/o
											</SelectItem>
											<SelectItem :value="2">
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
					<FormField v-slot="{ componentField }" name="reelection">
						<FormItem>
							<FormLabel>Periodo de reelección</FormLabel>
							<FormControl>
								<Select v-bind="componentField">
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
								<Select v-bind="componentField">
									<SelectTrigger>
										<SelectValue
											placeholder="Seleccione una opción" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup
											v-for="compensatory in getCompensatory"
											:key="compensatory.id">
											<SelectItem
												:value="compensatory.id">
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
				<div v-show="showLGBTTTIQ">
					<div>
						<FormField v-slot="{ componentField }" name="gender_id">
							<FormItem>
								<FormLabel>Género</FormLabel>
								<FormControl>
									<Select v-bind="componentField">
										<SelectTrigger>
											<SelectValue
												placeholder="Seleccione una opción" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup
												v-for="gender in getGenres"
												:key="gender.id">
												<SelectItem :value="gender.id">
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
				</div>
				<div v-show="showMote">
					<FormField v-slot="{ componentField }" name="mote">
						<FormItem>
							<FormLabel>Sobrenombre</FormLabel>
							<FormControl>
								<Input type="text" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</div>
			</div>
		</CardContent>
	</Card>
</template>

<style scoped></style>
