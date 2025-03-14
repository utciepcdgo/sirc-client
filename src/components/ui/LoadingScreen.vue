<script lang="ts" setup>
import {FingerprintSpinner, LoopingRhombusesSpinner} from 'epic-spinners';
import AnimatedBackground from '@/components/ui/AnimatedBackground.vue';

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	loadingText: {
		type: String,
		default: 'Cargando...',
	},
});
</script>

<template>
	<Transition name="fade">
		<div v-if="show" class="loading-overlay">
			<div class="loading-content flex flex-col items-center">
				<LoopingRhombusesSpinner
					:animation-duration="1500"
					:color="'#ffffff'"
					:size="128" />
				<p class="text-white font-bold mt-5">{{ loadingText }}</p>
			</div>
		</div>
	</Transition>
</template>

<style scoped>
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.loading-content {
	text-align: center;
}

/* Fade Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
