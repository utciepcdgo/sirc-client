<script lang="ts" setup>
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover'
defineProps<{ message: string }>();
</script>

<template>

  <Popover modal="true">
    <PopoverTrigger @click.prevent>
      <slot></slot>
    </PopoverTrigger>
    <PopoverContent>
      <div v-html="message"></div><!-- ✅ Usa un slot en lugar de v-html -->
    </PopoverContent>
  </Popover>

</template>

<style scoped>

</style>