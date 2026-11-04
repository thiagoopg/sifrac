<template>
  <div :class="cn('mt-4 text-sm text-muted-foreground', className)">
    <slot />
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
defineProps({
  className: String
})
</script>
