<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Admins de Campus</h1>
    
    <div v-if="isAdminPrincipal" class="mb-4">
      <p class="text-sm text-gray-600 mb-2">Usuários com perfil Coordenador de Campus:</p>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="p-4 text-left text-gray-600 font-medium">Nome</th>
              <th class="p-4 text-left text-gray-600 font-medium">Campus</th>
              <th class="p-4 text-left text-gray-600 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="admin in admins" :key="admin.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="p-4">{{ admin.nome }}</td>
              <td class="p-4">{{ admin.campusNome }}</td>
              <td class="p-4">
                <button 
                  @click="removerAdmin(admin.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Remover
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div v-else class="mt-6">
      <p class="text-sm text-gray-600">Apenas o admin principal pode ver esta página.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import { useAuth, PERFIS } from '@/lib/auth'

const { isAdministrador } = useAuth()

const admins = ref([])
const isAdminPrincipal = ref(false)
const loading = ref(true)

async function loadAdmins() {
  loading.value = true
  try {
    const res = await api.get('/usuarios/campus-admins')
    admins.value = res.data
    isAdminPrincipal.value = admins.value.length > 0
  } catch (err) {
    console.error('Erro ao carregar admins:', err)
  } finally {
    loading.value = false
  }
}

function removerAdmin(id) {
  if (!confirm('Tem certeza que deseja remover este admin de campus?')) return
  api.delete(`/usuarios/${id}/campus-admin`).then(() => {
    loadAdmins()
  })
}

onMounted(loadAdmins)

// Watch for user changes - when perfil changes, reload
watch(isAdministrador, (isAdmin) => {
  if (isAdmin) loadAdmins()
}, { immediate: true })
</script>