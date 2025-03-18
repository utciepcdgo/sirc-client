<!-- src/components/ui/TooltipWrapper.vue -->
<script lang="ts" setup>
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const props = defineProps({
	message: String,
	delay: {
		type: Number,
		default: 100,
	},
});
</script>

<template>
	<TooltipProvider :delay-duration="props.delay">
		<Tooltip>
			<TooltipTrigger as-child>
				<span tabindex="-1" aria-hidden="true">
					<slot></slot>
				</span>
			</TooltipTrigger>
			<TooltipContent tabindex="-1" aria-hidden="true">
				<p>{{ props.message }}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
</template>

<style scoped></style>
