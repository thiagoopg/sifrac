<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'
import { ArrowLeft, Clock, User, FileText, CheckCircle, XCircle, Trash2 } from 'lucide-vue-next'
import { PERFIS } from '@/lib/auth'

const router = useRouter()
const route = useRoute()
const solicitacaoId = Number(route.params.id)

const loading = ref(true)
const error = ref('')
const auditLogs = ref([])
const solicitacao = ref(null)

const acaoConfig = {
  CRIACAO: {
    icon: FileText,
    color: 'bg-blue-100 text-blue-700',
    label: 'Criação'
  },
  AVALIACAO: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700',
    label: 'Avaliação'
  },
  CANCELAMENTO: {
    icon: Trash2,
    color: 'bg-red-100 text-red-700',
    label: 'Cancelamento'
  }
}

function extractError(err) {
  const status = err?.response?.status
  const errorCode = err?.response?.data?.errorCode
  if (status === 403 || errorCode === 'PERMISSAO_NEGADA') {
    return 'Você não tem permissão para visualizar o histórico desta solicitação.'
  }
  if (status === 404) {
    return 'Solicitação não encontrada.'
  }
  return err?.response?.data?.message || 'Erro ao carregar os dados da solicitação.'
}

function voltar() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'Solicitacoes' })
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function statusBadge(status) {
  if (!status) return null
  const colors = {
    PENDENTE: 'bg-yellow-100 text-yellow-700',
    DEFERIDO: 'bg-green-100 text-green-700',
    INDEFERIDO: 'bg-red-100 text-red-700',
    CANCELADO: 'bg-gray-100 text-gray-500'
  }
  const labels = {
    PENDENTE: 'Pendente',
    DEFERIDO: 'Deferido',
    INDEFERIDO: 'Indeferido',
    CANCELADO: 'Cancelado'
  }
  return { class: colors[status] || 'bg-gray-100 text-gray-500', label: labels[status] || status }
}

async function carregarDados() {
  loading.value = true
  error.value = ''
  try {
    const [solicitacaoRes, auditRes] = await Promise.all([
      api.get(`/solicitacoes/${solicitacaoId}`),
      api.get(`/solicitacoes/${solicitacaoId}/audit`)
    ])
    solicitacao.value = solicitacaoRes.data
    auditLogs.value = auditRes.data || []
  } catch (e) {
    error.value = extractError(e)
  } finally {
    loading.value = false
  }
}

onMounted(carregarDados)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button
        @click="voltar"
        class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        Voltar
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Histórico de Auditoria</h1>
    </div>

    <!-- Solicitação Info -->
    <div v-if="solicitacao" class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Solicitação</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span class="text-gray-500">Aluno:</span>
          <p class="font-medium text-gray-900">{{ solicitacao.nomeAluno }}</p>
        </div>
        <div>
          <span class="text-gray-500">Tipo de Hora:</span>
          <p class="font-medium text-gray-900">{{ solicitacao.tipoHoraNome }}</p>
        </div>
        <div>
          <span class="text-gray-500">Título:</span>
          <p class="font-medium text-gray-900">{{ solicitacao.titulo || '—' }}</p>
        </div>
        <div>
          <span class="text-gray-500">Horas Solicitadas:</span>
          <p class="font-medium text-gray-900">{{ solicitacao.horasSolicitadas }}h</p>
        </div>
        <div>
          <span class="text-gray-500">Horas Deferidas:</span>
          <p class="font-medium text-gray-900">{{ solicitacao.horasDeferidas || 0 }}h</p>
        </div>
        <div>
          <span class="text-gray-500">Status Atual:</span>
          <span
            :class="[
              'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
              statusBadge(solicitacao.status)?.class
            ]"
          >
            {{ statusBadge(solicitacao.status)?.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Timeline de Auditoria -->
    <div data-testid="audit-timeline" class="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div class="px-6 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900">Timeline de Eventos</h2>
        <p class="text-sm text-gray-500 mt-0.5">{{ auditLogs.length }} registro{{ auditLogs.length !== 1 ? 's' : '' }} encontrado{{ auditLogs.length !== 1 ? 's' : '' }}</p>
      </div>

      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin w-6 h-6 border-2 border-green-200 border-t-[#399c3c] rounded-full mx-auto" />
      </div>

      <div v-else-if="error" class="p-8 text-center">
        <p class="text-red-600 text-sm">{{ error }}</p>
        <button @click="carregarDados" class="mt-3 text-sm text-[#399c3c] hover:underline">Tentar novamente</button>
      </div>

      <div v-else-if="auditLogs.length === 0" class="p-8 text-center">
        <FileText class="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500 text-sm">Nenhum registro de auditoria encontrado</p>
      </div>

      <div v-else class="divide-y divide-gray-50">
        <div
          v-for="(log, index) in auditLogs"
          :key="log.id"
          class="px-6 py-4 flex gap-4 hover:bg-gray-50 transition-colors"
        >
          <!-- Timeline line -->
          <div class="flex flex-col items-center">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                acaoConfig[log.acao]?.color || 'bg-gray-100 text-gray-600'
              ]"
            >
              <component
                :is="acaoConfig[log.acao]?.icon || FileText"
                class="w-4 h-4"
              />
            </div>
            <div v-if="index < auditLogs.length - 1" class="w-px h-full bg-gray-200 my-1" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-medium text-gray-900">{{ acaoConfig[log.acao]?.label || log.acao }}</span>
              <span class="text-gray-400">por</span>
              <span class="text-sm text-gray-600 flex items-center gap-1">
                <User class="w-3 h-3" />
                {{ log.usuarioNome }}
              </span>
              <span class="text-gray-400 text-sm flex items-center gap-1">
                <Clock class="w-3 h-3" />
                {{ formatDateTime(log.criadoEm) }}
              </span>
            </div>

            <!-- Status transition -->
            <div v-if="log.statusAnterior || log.statusNovo" class="mt-2 flex items-center gap-2 text-sm">
              <span
                v-if="log.statusAnterior"
                class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 line-through"
              >
                {{ log.statusAnterior }}
              </span>
              <span v-if="log.statusAnterior && log.statusNovo" class="text-gray-400">→</span>
              <span
                v-if="log.statusNovo"
                :class="[
                  'px-2 py-0.5 rounded text-xs font-medium',
                  statusBadge(log.statusNovo)?.class
                ]"
              >
                {{ log.statusNovo }}
              </span>
            </div>

            <!-- Description -->
            <p v-if="log.descricao" class="mt-1.5 text-sm text-gray-600">{{ log.descricao }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
