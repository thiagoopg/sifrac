<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-vue-next'
import { useAuth, PERFIS } from '@/lib/auth'

const router = useRouter()

// ── Composable de autenticação (Vue 3 Composition API) ──────────────────────
const { perfil, usuarioId, cursoId, cursoNome, campusId } = useAuth()

// Derivação reativa do campus admin
const isCampusAdmin = computed(() => perfil.value === PERFIS.ADMIN_CAMPUS)

const stats = ref({ total: 0, pendentes: 0, deferidas: 0, indeferidas: 0 })
const solicitacoesRecentes = ref([])
const loading = ref(true)

const cardStyles = [
  { icon: FileText, color: 'blue', label: 'Total', statKey: 'total' },
  { icon: Clock, color: 'yellow', label: 'Pendentes', statKey: 'pendentes' },
  { icon: CheckCircle, color: 'green', label: 'Deferidas', statKey: 'deferidas' },
  { icon: XCircle, color: 'red', label: 'Indeferidas', statKey: 'indeferidas' },
]

const alunoStats = ref({
  horasNecessarias: 0,
  horasDeferidas: 0,
  horasFaltando: 0,
  progresso: 0
})

async function carregarDados () {
  loading.value = true
  try {
    if (isCampusAdmin.value) {
      if (!campusId.value) return
      const res = await api.get('/solicitacoes', { params: { campusId: campusId.value } })
      const todas = res.data || []
      stats.value = {
        total: todas.length,
        pendentes: todas.filter(s => s.status === 'PENDENTE').length,
        deferidas: todas.filter(s => s.status === 'DEFERIDO').length,
        indeferidas: todas.filter(s => s.status === 'INDEFERIDO').length,
      }
      solicitacoesRecentes.value = todas.sort((a, b) => new Date(b.dataSolicitacao) - new Date(a.dataSolicitacao))
    } else if (perfil.value === PERFIS.ADMINISTRADOR) {
      const res = await api.get('/solicitacoes')
      const todas = res.data || []
      stats.value = {
        total: todas.length,
        pendentes: todas.filter(s => s.status === 'PENDENTE').length,
        deferidas: todas.filter(s => s.status === 'DEFERIDO').length,
        indeferidas: todas.filter(s => s.status === 'INDEFERIDO').length,
      }
      solicitacoesRecentes.value = todas.sort((a, b) => new Date(b.dataSolicitacao) - new Date(a.dataSolicitacao))
    } else if (perfil.value === PERFIS.COORDENADOR) {
      if (!cursoId.value) return
      const res = await api.get('/solicitacoes', { params: { cursoId: cursoId.value } })
      const todas = res.data || []
      stats.value = {
        total: todas.length,
        pendentes: todas.filter(s => s.status === 'PENDENTE').length,
        deferidas: todas.filter(s => s.status === 'DEFERIDO').length,
        indeferidas: todas.filter(s => s.status === 'INDEFERIDO').length,
      }
      solicitacoesRecentes.value = todas.sort((a, b) => new Date(b.dataSolicitacao) - new Date(a.dataSolicitacao))
    } else if (perfil.value === PERFIS.ALUNO) {
      if (!usuarioId.value) return
      const res = await api.get('/solicitacoes/meu', { params: { userId: usuarioId.value } })
      const todas = res.data || []
      stats.value = {
        total: todas.length,
        pendentes: todas.filter(s => s.status === 'PENDENTE').length,
        deferidas: todas.filter(s => s.status === 'DEFERIDO').length,
        indeferidas: todas.filter(s => s.status === 'INDEFERIDO').length,
      }
      solicitacoesRecentes.value = todas.sort((a, b) => new Date(b.dataSolicitacao) - new Date(a.dataSolicitacao))

      // Backend retorna 'horasDeferidas' (com 's')
      const horasDeferidas = todas
        .filter(s => s.status === 'DEFERIDO')
        .reduce((acc, s) => acc + (s.horasDeferidas || s.horasSolicitadas || 0), 0)

      if (cursoId.value) {
        const cursoRes = await api.get(`/cursos/${cursoId.value}`)
        const cargaHoraria = cursoRes.data?.cargaHorariaAcExigida || 0

        alunoStats.value = {
          horasNecessarias: cargaHoraria,
          horasDeferidas,
          horasFaltando: Math.max(0, cargaHoraria - horasDeferidas),
          progresso: cargaHoraria > 0 ? Math.round((horasDeferidas / cargaHoraria) * 100) : 0
        }
      }
    }
  } catch (e) {
    console.error('[Dashboard] ERRO:', e)
  } finally {
    loading.value = false
  }
}

function statusClass (status) {
  if (status === 'PENDENTE') return 'bg-yellow-100 text-yellow-700'
  if (status === 'DEFERIDO') return 'bg-green-100 text-green-700'
  if (status === 'INDEFERIDO') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-700'
}

function formatarData (data) {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

function handleAvaliar (solicitacao) {
  router.push({ path: '/solicitacoes', query: { avaliar: solicitacao.id } })
}

onMounted(() => {
  carregarDados()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin w-8 h-8 border-4 border-green-200 border-t-[#399c3c] rounded-full" />
    </div>

    <div v-else>
      <div v-if="perfil === PERFIS.ALUNO" class="bg-gradient-to-r from-[#399c3c] to-[#195128] rounded-xl p-6 mb-8 text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold mb-1">Progresso de Horas Complementares</h2>
            <p class="text-green-100 text-sm">{{ cursoId ? 'Curso: ' + cursoNome : '' }}</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold">{{ alunoStats.horasDeferidas }}h</div>
            <div class="text-green-200 text-sm">de {{ alunoStats.horasNecessarias }}h necessárias</div>
          </div>
        </div>

        <div class="relative h-3 bg-green-800 rounded-full overflow-hidden">
          <div
            class="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-500"
            :style="{ width: Math.min(alunoStats.progresso, 100) + '%' }"
          />
        </div>

        <div class="flex justify-between mt-3 text-sm">
          <span class="text-green-200">Início: 0h</span>
          <span class="font-semibold">{{ alunoStats.progresso }}% concluído</span>
          <span class="text-green-200">Meta: {{ alunoStats.horasNecessarias }}h</span>
        </div>

        <div class="flex gap-6 mt-5 pt-4 border-t border-green-500">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-400" />
            <span class="text-sm text-green-100">Concluídas: <strong class="text-white">{{ alunoStats.horasDeferidas }}h</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-yellow-400" />
            <span class="text-sm text-green-100">Faltando: <strong class="text-white">{{ alunoStats.horasFaltando }}h</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-300" />
            <span class="text-sm text-green-100">Total necessário: <strong class="text-white">{{ alunoStats.horasNecessarias }}h</strong></span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="card in cardStyles"
          :key="card.label"
          :data-testid="'stat-' + card.statKey"
          class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">{{ card.label }}</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats[card.statKey] }}</p>
            </div>
            <component
              :is="card.icon"
              class="w-10 h-10"
              :class="{
                 'text-[#399c3c] bg-green-50': card.color === 'blue',
                'text-yellow-600 bg-yellow-50': card.color === 'yellow',
                'text-green-600 bg-green-50': card.color === 'green',
                'text-red-600 bg-red-50': card.color === 'red',
              }"
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-900">
            {{ perfil === PERFIS.COORDENADOR ? 'Solicitações do Curso' : 'Suas Solicitações' }}
          </h2>
        </div>
        <div v-if="solicitacoesRecentes.length === 0" class="p-8 text-center text-gray-500 text-sm">
          Nenhuma solicitação encontrada 🎉
        </div>
        <table v-else class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Aluno</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Tipo Hora</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Horas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Data</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th v-if="perfil === PERFIS.COORDENADOR" class="px-6 py-3 text-right text-xs font-medium text-gray-500">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="s in solicitacoesRecentes"
              :key="s.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 font-medium text-gray-900">{{ s.nomeAluno }}</td>
              <td class="px-6 py-4 text-gray-600">{{ s.tipoHoraNome }}</td>
              <td class="px-6 py-4 text-gray-600">{{ s.horasSolicitadas }}h</td>
              <td class="px-6 py-4 text-gray-500">{{ formatarData(s.dataSolicitacao) }}</td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="statusClass(s.status)">
                  {{ s.status }}
                </span>
              </td>
              <td v-if="perfil === PERFIS.COORDENADOR" class="px-6 py-4 text-right">
                <button
                  v-if="s.status === 'PENDENTE'"
                  @click="handleAvaliar(s)"
                   class="px-3 py-1.5 bg-[#399c3c] text-white text-xs font-medium rounded-lg hover:bg-[#195128] transition-colors"
                >
                  Avaliar
                </button>
                <span v-else class="text-gray-400 text-xs">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
