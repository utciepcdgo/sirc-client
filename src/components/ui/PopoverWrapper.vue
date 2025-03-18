<script lang="ts" setup>
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
defineProps<{ message: string }>();
</script>

<template>
	<Popover :modal="true">
		<PopoverTrigger as-child>
			<span tabindex="-1" aria-hidden="true">
				<slot></slot>
			</span>
		</PopoverTrigger>
		<PopoverContent tabindex="-1" aria-hidden="true">
			<div v-html="message"></div>
		</PopoverContent>
	</Popover>
</template>

<style scoped></style>
