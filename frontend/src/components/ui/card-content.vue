<template>
  <div :class="cn('flex flex-col gap-1 p-6', className)">
    <slot />
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
defineProps({
  className: String
})
</script>
