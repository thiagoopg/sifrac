<template>
  <div :class="cn('flex h-[200px] items-center justify-center border rounded-md', className)">
    <slot />
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
defineProps({
  className: String
})
</script>
