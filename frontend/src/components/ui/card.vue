<template>
  <div :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)">
    <slot />
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
defineProps({
  className: String
})
</script>
