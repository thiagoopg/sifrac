<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { Plus, Eye, Trash2 } from 'lucide-vue-next'

const itens = ref([])
const loading = ref(true)
const busca = ref('')
const filtroCampus = ref('')
const campi = ref([])

const itensFiltrados = computed(() => {
  let resultado = itens.value
  if (busca.value) {
    const termo = busca.value.toLowerCase()
    resultado = resultado.filter(item =>
      item.nomeUsuario?.toLowerCase().includes(termo) ||
      item.emailUsuario?.toLowerCase().includes(termo)
    )
  }
  if (filtroCampus.value) {
    resultado = resultado.filter(item => item.campusId === Number(filtroCampus.value))
  }
  return resultado
})

onMounted(async () => {
  try {
    const [alunosRes, campusRes] = await Promise.all([
      api.get('/alunos'),
      api.get('/campuses')
    ])
    itens.value = alunosRes.data
    campi.value = campusRes.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Alunos</h1>
      <button class="inline-flex items-center gap-2 px-4 py-2 bg-[#399c3c] hover:bg-[#195128] text-white rounded-lg text-sm font-medium transition-colors">
        <Plus class="w-4 h-4" />
        Novo Aluno
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div class="p-4 border-b border-gray-100 flex gap-3">
        <input
          v-model="busca"
          type="text"
          data-testid="input-busca-aluno"
          placeholder="Buscar aluno..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c]"
        />
        <select
          v-model="filtroCampus"
          data-testid="select-campus"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c]"
        >
          <option value="">Todos os campi</option>
          <option v-for="campus in campi" :key="campus.id" :value="campus.id">{{ campus.sigla }}</option>
        </select>
      </div>
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin w-6 h-6 border-2 border-green-200 border-t-[#399c3c] rounded-full mx-auto" />
      </div>
      <table v-else class="w-full text-sm" data-testid="tabela-alunos">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="item in itensFiltrados" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <p class="font-medium text-gray-900">{{ item.nomeUsuario }}</p>
              <p class="text-xs text-gray-500">{{ item.emailUsuario }}</p>
            </td>
            <td class="px-6 py-4 font-mono text-gray-600 text-xs">{{ item.matricula }}</td>
            <td class="px-6 py-4 text-gray-600">{{ item.cursoNome }}</td>
            <td class="px-6 py-4 text-right">
              <button class="text-gray-400 hover:text-[#399c3c] mr-3 transition-colors">
                <Eye class="w-4 h-4" />
              </button>
              <button class="text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
