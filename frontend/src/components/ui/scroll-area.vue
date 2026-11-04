<template>
  <div :class="cn('relative w-full overflow-auto scroll-smooth', className)">
    <slot />
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
defineProps({
  className: String
})
</script>
