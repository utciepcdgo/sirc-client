<script lang="ts" setup>
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
import { useLocationStore } from '@/stores/location';

const locationStore = useLocationStore();
</script>

<template>
	<Card class="flex-1">
		<CardHeader class="text-center">
			<CardTitle class="text-2xl font-extrabold">Residencia</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
				<div>
					<FormField
						v-slot="{ componentField }"
						name="residence.state">
						<FormItem>
							<FormLabel>Estado</FormLabel>
							<FormControl>
								<Select
									v-model="
										locationStore.selectedStateResidence
									"
									v-bind="componentField">
									<SelectTrigger>
										<SelectValue
											placeholder="Select a State" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup
											v-for="state in locationStore.states"
											:key="state.id">
											<SelectItem :value="state.name"
												>{{ state.name }}
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
						name="residence.municipality">
						<FormItem>
							<FormLabel>Municipio</FormLabel>
							<FormControl>
								<Select
									v-model="
										locationStore.selectedMunicipalityResidence
									"
									v-bind="componentField">
									<SelectTrigger>
										<SelectValue
											placeholder="Select a Municipality" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup
											v-for="municipality in locationStore.municipalities"
											:key="municipality.id">
											<SelectItem
												:value="municipality.name"
												>{{
													municipality.name
												}}</SelectItem
											>
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
						name="residence.city">
						<FormItem>
							<FormLabel>Ciudad/Localidad</FormLabel>
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
							<FormLabel>Colonia/Fraccionamiento</FormLabel>
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
				<div>
					<FormField
						v-slot="{ componentField }"
						name="residence.inside_number">
						<FormItem>
							<FormLabel>Número exterior</FormLabel>
							<FormControl>
								<Input type="text" v-bind="componentField" />
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
								<Input type="text" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</div>
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
		</CardContent>
	</Card>
</template>

<style scoped></style>
