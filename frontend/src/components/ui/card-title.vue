<template>
  <div :class="cn('font-semibold leading-none tracking-tight', className)">
    <slot />
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
defineProps({
  className: String
})
</script>
