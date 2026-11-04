<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { Plus, CheckCircle, XCircle } from 'lucide-vue-next'
import { useAuth, PERFIS } from '@/lib/auth'

const { user: usuario, isLoggedIn } = useAuth()

const podeAvaliar = computed(() => {
  const p = usuario.value?.perfil
  return p === PERFIS.COORDENADOR
})

const statusConfig = {
  PENDENTE: { class: 'bg-yellow-100 text-yellow-700', label: 'Pendente' },
  DEFERIDO: { class: 'bg-green-100 text-green-700', label: 'Deferido' },
  INDEFERIDO: { class: 'bg-red-100 text-red-700', label: 'Indeferido' },
  CANCELADO: { class: 'bg-gray-100 text-gray-500', label: 'Cancelado' },
}

const todosItems = ref([])
const loading = ref(true)
const filtroStatus = ref('')

const itens = computed(() => {
  if (!filtroStatus.value) return todosItems.value
  return todosItems.value.filter(s => s.status === filtroStatus.value)
})

const avaliandoItem = ref(null)
const avaliacaoForm = ref({ horasDeferidas: null, status: 'DEFERIDO', justificativaCoordenador: '' })
const avaliacaoError = ref('')
const avaliacaoSaving = ref(false)
const avaliacaoModalOpen = ref(false)

// Nova solicitação state
const novaSolicitacaoModal = ref(false)
const createForm = ref({ tipoHoraId: null, titulo: '', horasSolicitadas: null, arquivo: null })
const createError = ref('')
const createSaving = ref(false)
const tiposHora = ref([])
const previewFile = ref(null)

function getMimeType(url) {
  if (!url) return 'application/pdf'
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase()
  const mimeMap = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    txt: 'text/plain'
  }
  return mimeMap[ext] || 'application/pdf'
}

async function carregar() {
  loading.value = true
  try {
    const res = await api.get('/solicitacoes/meu', { params: { userId: usuario.value?.id } })
    todosItems.value = res.data
  } finally {
    loading.value = false
  }
}

function openAvaliacao(item) {
  avaliandoItem.value = item
  avaliacaoForm.value = { horasDeferidas: null, status: 'DEFERIDO', justificativaCoordenador: '' }
  avaliacaoError.value = ''
  avaliacaoModalOpen.value = true
}

async function salvarAvaliacao() {
  avaliacaoError.value = ''
  if (!avaliacaoForm.value.horasDeferidas && avaliacaoForm.value.status === 'DEFERIDO') {
    avaliacaoError.value = 'Informe as horas deferidas.'
    return
  }
  if (avaliacaoForm.value.status === 'INDEFERIDO' && !avaliacaoForm.value.justificativaCoordenador.trim()) {
    avaliacaoError.value = 'Justificativa é obrigatória para indeferimento.'
    return
  }
  avaliacaoSaving.value = true
  try {
    await api.put(`/solicitacoes/${avaliandoItem.value.id}/avaliar`, {
      coordenadorId: usuario.value.id,
      horasDeferidas: avaliacaoForm.value.status === 'DEFERIDO' ? avaliacaoForm.value.horasDeferidas : 0,
      status: avaliacaoForm.value.status,
      justificativaCoordenador: avaliacaoForm.value.justificativaCoordenador
    })
    avaliacaoModalOpen.value = false
    await carregar()
  } catch (e) {
    avaliacaoError.value = e.response?.data?.message || 'Erro ao avaliar solicitação.'
  } finally {
    avaliacaoSaving.value = false
  }
}

async function openNovaSolicitacao() {
  createError.value = ''
  createForm.value = { tipoHoraId: null, titulo: '', horasSolicitadas: null, arquivo: null }
  novaSolicitacaoModal.value = true
  // Busca os tipos de hora do curso
  try {
    const tiposRes = await api.get('/tipos-hora', { params: { cursoId: usuario.value.cursoId } })
    tiposHora.value = tiposRes.data
  } catch (e) {
    createError.value = 'Não foi possível carregar os tipos de hora disponíveis.'
  }
}

async function criarSolicitacao() {
  createError.value = ''
  if (!createForm.value.tipoHoraId) {
    createError.value = 'Selecione um tipo de hora complementar.'
    return
  }
  if (!createForm.value.titulo?.trim()) {
    createError.value = 'Informe o título da atividade.'
    return
  }
  if (!createForm.value.horasSolicitadas || createForm.value.horasSolicitadas < 1) {
    createError.value = 'Informe a quantidade de horas solicitadas.'
    return
  }
  createSaving.value = true
  try {
    const formData = new FormData()
    formData.append('tipoHoraId', createForm.value.tipoHoraId)
    formData.append('titulo', createForm.value.titulo.trim())
    formData.append('horasSolicitadas', createForm.value.horasSolicitadas)
    if (createForm.value.arquivo) {
      formData.append('arquivo', createForm.value.arquivo)
    }
    await api.post('/solicitacoes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    novaSolicitacaoModal.value = false
    await carregar()
  } catch (e) {
    createError.value = e.response?.data?.message || 'Erro ao criar solicitação.'
  } finally {
    createSaving.value = false
  }
}

onMounted(carregar)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Solicitações</h1>
      <button
        v-if="usuario?.perfil === PERFIS.ALUNO"
        data-testid="botao-nova-solicitacao"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#399c3c] hover:bg-[#195128] text-white rounded-lg text-sm font-medium transition-colors"
        @click="openNovaSolicitacao()"
      >
        <Plus class="w-4 h-4" />
        Nova Solicitação
      </button>
    </div>

    <div class="flex gap-2 mb-4">
      <button
        @click="filtroStatus=''"
        :data-testid="filtroStatus === '' ? 'filtro-todos-active' : 'filtro-todos'"
        :class="['px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', !filtroStatus ? 'bg-[#195128] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300']"
      >
        Todos
      </button>
      <button
        @click="filtroStatus='PENDENTE'"
        :data-testid="filtroStatus === 'PENDENTE' ? 'filtro-pendentes-active' : 'filtro-pendentes'"
        :class="['px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', filtroStatus==='PENDENTE' ? 'bg-[#F7C514] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-yellow-300']"
      >
        Pendentes
      </button>
      <button
        @click="filtroStatus='DEFERIDO'"
        :data-testid="filtroStatus === 'DEFERIDO' ? 'filtro-deferidas-active' : 'filtro-deferidas'"
        :class="['px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', filtroStatus==='DEFERIDO' ? 'bg-[#399c3c] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300']"
      >
        Deferidas
      </button>
      <button
        @click="filtroStatus='INDEFERIDO'"
        :data-testid="filtroStatus === 'INDEFERIDO' ? 'filtro-indeferidas-active' : 'filtro-indeferidas'"
        :class="['px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', filtroStatus==='INDEFERIDO' ? 'bg-[#ca1e25] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300']"
      >
        Indeferidas
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin w-6 h-6 border-2 border-green-200 border-t-[#399c3c] rounded-full mx-auto" />
      </div>
      <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Aluno</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Título</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Curso</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Horas</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Anexo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Data</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Histórico</th>
            <th v-if="podeAvaliar" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="item in itens" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">{{ item.nomeAluno }}</td>
            <td class="px-6 py-4 text-gray-700 text-xs">{{ item.titulo || '—' }}</td>
            <td class="px-6 py-4 text-gray-600 text-xs">{{ item.cursoNome }}</td>
            <td class="px-6 py-4 text-gray-600 text-xs">{{ item.tipoHoraNome }}</td>
            <td class="px-6 py-4 text-gray-800 font-medium">{{ item.horasSolicitadas }}h</td>
            <td class="px-6 py-4">
                <a v-if="item.anexos?.length" @click.prevent="previewFile = item.anexos[0].urlArquivo" class="text-[#399c3c] hover:text-[#195128] text-xs underline cursor-pointer">
                 {{ item.anexos[0].nomeArquivo }}
               </a>
               <span v-else class="text-gray-400 text-xs">—</span>
             </td>
            <td class="px-6 py-4">
              <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', statusConfig[item.status]?.class || 'bg-gray-100 text-gray-700']">
                {{ statusConfig[item.status]?.label || item.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">{{ item.dataSolicitacao?.slice(0, 10) }}</td>
            <td class="px-6 py-4 text-right">
              <RouterLink
                :to="{ name: 'Audit', params: { id: item.id } }"
                data-testid="ver-historico"
                class="text-[#399c3c] hover:text-[#195128] underline text-xs whitespace-nowrap"
              >
                Ver histórico
              </RouterLink>
            </td>
            <td v-if="podeAvaliar" class="px-6 py-4 text-right">
              <button v-if="item.status === 'PENDENTE'" @click="openAvaliacao(item)" class="text-[#399c3c] hover:text-[#195128] mr-2 transition-colors" title="Deferir">
                <CheckCircle class="w-4 h-4" />
              </button>
              <button v-if="item.status === 'PENDENTE'" @click="openAvaliacao(item)" class="text-[#ca1e25] hover:text-red-700 mr-2 transition-colors" title="Indeferir">
                <XCircle class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      <div v-if="!loading && itens.length === 0" class="p-8 text-center text-gray-500 text-sm">
        Nenhuma solicitação encontrada.
      </div>
    </div>

    <!-- Modal Avaliação -->
    <div
      v-if="avaliacaoModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="avaliacaoModalOpen = false"
      @keydown.escape="avaliacaoModalOpen = false"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Avaliar Solicitação</h2>
        <p class="text-sm text-gray-500 mb-4">
          {{ avaliandoItem?.nomeAluno }} — {{ avaliandoItem?.tipoHoraNome }} ({{ avaliandoItem?.horasSolicitadas }}h)
        </p>

        <div v-if="avaliacaoError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ avaliacaoError }}
        </div>

        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          v-model="avaliacaoForm.status"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
        >
          <option value="DEFERIDO">Deferir</option>
          <option value="INDEFERIDO">Indeferir</option>
        </select>

        <label class="block text-sm font-medium text-gray-700 mb-1">
          Horas deferidas
          <span v-if="avaliacaoForm.status === 'INDEFERIDO'" class="text-gray-400 font-normal">(não aplicável)</span>
        </label>
        <input
          v-if="avaliacaoForm.status === 'DEFERIDO'"
          v-model.number="avaliacaoForm.horasDeferidas"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Quantas horas serão deferidas?"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">
          Justificativa
          <span v-if="avaliacaoForm.status === 'INDEFERIDO'" class="text-red-500">*</span>
        </label>
        <textarea
          v-model="avaliacaoForm.justificativaCoordenador"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-6"
          placeholder="Justificativa da avaliação..."
        />

        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            @click="avaliacaoModalOpen = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-[#399c3c] text-white rounded-lg text-sm font-medium hover:bg-[#195128] transition-colors disabled:opacity-50"
            @click="salvarAvaliacao"
            :disabled="avaliacaoSaving"
          >
            {{ avaliacaoSaving ? 'Avaliando...' : 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Nova Solicitação -->
    <div
      v-if="novaSolicitacaoModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="novaSolicitacaoModal = false"
      @keydown.escape="novaSolicitacaoModal = false"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Nova Solicitação</h2>
        <p class="text-sm text-gray-500 mb-4">
          Preencha os dados abaixo para solicitar horas complementares.
        </p>

        <div v-if="createError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ createError }}
        </div>

        <label class="block text-sm font-medium text-gray-700 mb-1">
          Título da Atividade *
        </label>
        <input
          v-model.trim="createForm.titulo"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Ex: Curso de Extensão em Java — 20h"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Hora Complementar *
        </label>
        <select
          v-model="createForm.tipoHoraId"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
        >
          <option value="" disabled>Selecione o tipo de hora</option>
          <option v-for="tipo in tiposHora" :key="tipo.id" :value="tipo.id">
            {{ tipo.nome }} (máx. {{ tipo.cargaHorariaMaxima }}h)
          </option>
        </select>

        <label class="block text-sm font-medium text-gray-700 mb-1">
          Horas solicitadas *
        </label>
        <input
          v-model.number="createForm.horasSolicitadas"
          type="number"
          min="1"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Quantas horas deseja solicitar?"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">
          Anexo / Certificado
          <span class="text-gray-400 font-normal">(opcional — apenas PDF)</span>
        </label>
        <input
          type="file"
          accept=".pdf"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-6"
          @change="createForm.arquivo = $event.target.files[0] || null"
        />

        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            @click="novaSolicitacaoModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-[#399c3c] text-white rounded-lg text-sm font-medium hover:bg-[#195128] transition-colors disabled:opacity-50"
            @click="criarSolicitacao"
            :disabled="createSaving"
          >
            {{ createSaving ? 'Criando...' : 'Solicitar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Visualizar Anexo -->
    <div
      v-if="previewFile"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="previewFile = null"
      @keydown.escape.window="previewFile = null"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 h-[85vh] flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 truncate">Visualizar Anexo</h2>
          <button @click="previewFile = null" class="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none">&times;</button>
        </div>
        <div class="flex-1 overflow-hidden">
          <iframe
            :src="previewFile"
            class="w-full h-full border-0"
           :type="getMimeType(previewFile)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
