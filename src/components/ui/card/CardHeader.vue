<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('flex flex-col gap-y-1.5 p-6 pt-0 md:p-1 lg:p-1 xl:p-6', props.class)">
    <slot />
  </div>
</template>
