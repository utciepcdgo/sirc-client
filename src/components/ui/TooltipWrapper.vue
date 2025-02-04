<!-- src/components/ui/TooltipWrapper.vue -->
<script lang="ts" setup>
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

const props = defineProps({
  message: String,
  delay: {
    type: Number,
    default: 100
  }
});
</script>

<template>
  <TooltipProvider :delay-duration="props.delay">
    <Tooltip>
      <TooltipTrigger>
        <slot></slot>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ props.message }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped>
</style>