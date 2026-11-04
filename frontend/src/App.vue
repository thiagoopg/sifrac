<script setup>
import { useAuth } from '@/lib/auth'

// Inicializa o composable para garantir que o estado reativo esteja sincronizado
useAuth()
</script>

<template>
  <router-view />
</template>
