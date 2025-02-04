<script lang="ts" setup>
const props = defineProps({
  title: String,
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <header class="mx-auto max-w-2xl text-center absolute left-0 right-0 top-[-23px]">
    <h1 class="text-xl font-extrabold tracking-tight sm:text-2xl inline-block bg-background px-4">{{ props.title }}</h1>
    <p class="text-sm font-semibold text-gray-400 hidden xl:block">{{ props.subtitle }}</p>
  </header>
</template>

<style scoped>

</style>