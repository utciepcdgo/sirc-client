<script setup lang="ts">
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { vMaska } from 'maska/vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useLocationStore } from "@/stores/location";
import { onMounted } from "vue";

const locationStore = useLocationStore();

onMounted(() => {
  locationStore.fetchStates();
});

</script>

<template>
	<Card>
		<CardHeader class="text-center">
			<CardTitle class="text-2xl font-extrabold"
				>Fecha y lugar de nacimiento</CardTitle
			>
		</CardHeader>
		<CardContent>
			<select v-model="locationStore.selectedStateBorn">
				<option
					v-for="state in locationStore.states"
					:key="state.id"
					:value="state.id">
					{{ state.name }}
				</option>
			</select>

			<select
				v-model="locationStore.selectedMunicipalityBorn"
				:disabled="!locationStore.selectedStateBorn">
				<option
					v-for="municipality in locationStore.municipalities"
					:key="municipality.id"
					:value="municipality.id">
					{{ municipality.name }}
				</option>
			</select>
			<div>
				<FormField v-slot="{ componentField }" name="birthplace.birth">
					<FormItem>
						<FormLabel>Fecha de nacimiento</FormLabel>
						<FormControl>
							<Input type="date" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
			</div>
			<div>
				<FormField
					v-slot="{ componentField }"
					name="born.state">
					<FormItem>
						<FormLabel>State</FormLabel>
						<FormControl>
							<Select v-bind="componentField">
								<SelectTrigger>
									<SelectValue
										placeholder="Select option">
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup
										v-for="state in states"
										:key="state.id">
										<SelectItem :value="state">
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
												? selectedMunicipality.name
												: ''
										}}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup
										v-for="municipality in municipalities"
										:key="municipality.id">
										<SelectItem :value="municipality">
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
		</CardContent>
	</Card>
</template>

<style scoped></style>
