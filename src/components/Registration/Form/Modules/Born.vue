<script lang="ts" setup>
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useLocationStore } from '@/stores/location';

const locationStore = useLocationStore();
</script>

<template>
	<Card>
		<CardHeader class="text-center">
			<CardTitle class="text-2xl font-extrabold"
				>Fecha y lugar de nacimiento
			</CardTitle>
		</CardHeader>
		<CardContent>
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
				<FormField v-slot="{ componentField }" name="birthplace.state">
					<FormItem>
						<FormLabel>Estado</FormLabel>
						<FormControl>
							<Select
								v-bind="componentField"
								v-model="locationStore.selectedStateBorn">
								<SelectTrigger>
									<SelectValue
										placeholder="Seleccione una opción" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup
										v-for="state in locationStore.states"
										:key="state.id">
										<SelectItem :value="state.name">{{
											state.name
										}}</SelectItem>
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
					name="birthplace.municipality">
					<FormItem>
						<FormLabel>Municipio</FormLabel>
						<FormControl>
							<Select
								v-bind="componentField"
								v-model="
									locationStore.selectedMunicipalityBorn
								">
								<SelectTrigger>
									<SelectValue
										placeholder="Seleccione una opción" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup
										v-for="municipality in locationStore.municipalities"
										:key="municipality.id">
										<SelectItem
											:value="municipality.name"
											>{{ municipality.name }}</SelectItem
										>
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
