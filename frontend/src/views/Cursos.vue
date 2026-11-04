<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import api from '@/services/api'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { useAuth, PERFIS } from '@/lib/auth'

const itens = ref([])
const loading = ref(true)

// Dados para selects
const campuses = ref([])
const graus = ref([])
const coordenadores = ref([])

// Modal create/edit
const modalOpen = ref(false)
const editingId = ref(null)
const form = ref({ nome: '', campusId: null, grauId: null, emailCoordenacao: '', cargaHorariaAcExigida: 0, coordenadorId: null, ativo: true })
const formError = ref('')
const saving = ref(false)

// Modal delete
const deleteModalOpen = ref(false)
const deletingItem = ref(null)

const isEdit = computed(() => editingId.value !== null)

// Novo: filtro por campus para admins de campus
const { perfil, campusId } = useAuth()
const isCampusAdmin = computed(() => perfil.value === PERFIS.ADMIN_CAMPUS)
const campusFilter = computed(() => isCampusAdmin.value ? campusId.value : null)

watch(campusFilter, (newFilter) => {
  if (newFilter !== null) {
    loadData()
  }
})

async function loadData() {
  loading.value = true
  try {
    const [campusRes, cursoRes, grauRes] = await Promise.all([
      api.get('/campuses'),
      campusFilter.value ? api.get(`/cursos?campusId=${campusFilter.value}`) : api.get('/cursos'),
      api.get('/graus')
    ])
    campuses.value = campusRes.data
    itens.value = cursoRes.data
    graus.value = grauRes.data
    // Filtrar apenas coordenadores para o select (alguns perfis não têm acesso à listagem de usuários)
    try {
      const userRes = await api.get('/usuarios')
      coordenadores.value = (userRes.data || []).filter(u => u.perfil === PERFIS.COORDENADOR && u.ativo)
    } catch {
      coordenadores.value = []
    }
  } finally {
    loading.value = false
  }
}

function openNew() {
  editingId.value = null
  form.value = { nome: '', campusId: null, grauId: graus.value[0]?.id ?? null, emailCoordenacao: '', cargaHorariaAcExigida: 0, coordenadorId: null, ativo: true }
  formError.value = ''
  modalOpen.value = true
}

function openEdit(item) {
  editingId.value = item.id
  form.value = {
    nome: item.nome,
    campusId: item.campusId,
    grauId: item.grauId,
    emailCoordenacao: item.emailCoordenacao,
    cargaHorariaAcExigida: item.cargaHorariaAcExigida,
    coordenadorId: item.coordenadorId || null,
    ativo: item.ativo
  }
  formError.value = ''
  modalOpen.value = true
}

function openDelete(item) {
  deletingItem.value = item
  deleteModalOpen.value = true
}

async function saveForm() {
  formError.value = ''
  if (!form.value.nome || !form.value.campusId || !form.value.grauId || !form.value.emailCoordenacao || !form.value.cargaHorariaAcExigida) {
    formError.value = 'Preencha todos os campos obrigatórios.'
    return
  }
  saving.value = true
  try {
    const body = {
      nome: form.value.nome,
      campusId: form.value.campusId,
      grauId: form.value.grauId,
      emailCoordenacao: form.value.emailCoordenacao,
      cargaHorariaAcExigida: form.value.cargaHorariaAcExigida,
      coordenadorId: form.value.coordenadorId
    }
    if (isEdit.value) {
      await api.put(`/cursos/${editingId.value}`, body)
    } else {
      await api.post('/cursos', body)
    }
    modalOpen.value = false
    await loadData()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Erro ao salvar curso.'
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  try {
    await api.delete(`/cursos/${deletingItem.value.id}`)
    deleteModalOpen.value = false
    await loadData()
  } catch (err) {
    console.error('Erro ao deletar curso:', err)
  }
}

onMounted(loadData)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Cursos</h1>
      <button
        data-testid="botao-novo-curso"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#399c3c] hover:bg-[#195128] text-white rounded-lg text-sm font-medium transition-colors"
        @click="openNew"
      >
        <Plus class="w-4 h-4" />
        Novo Curso
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin w-6 h-6 border-2 border-green-200 border-t-[#399c3c] rounded-full mx-auto" />
      </div>
      <table v-else class="w-full text-sm" data-testid="tabela-cursos">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grau</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carga Horária</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordenador</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="item in itens" :key="item.id" class="hover:bg-gray-50" :data-testid="'curso-' + item.nome">
            <td class="px-6 py-4 font-medium text-gray-900">{{ item.nome }}</td>
            <td class="px-6 py-4 text-gray-600">{{ item.campusNome }} ({{ item.campusSigla }})</td>
            <td class="px-6 py-4 text-gray-600">{{ item.grauNome || '—' }}</td>
            <td class="px-6 py-4 text-gray-800 font-medium">{{ item.cargaHorariaAcExigida }}h</td>
            <td class="px-6 py-4 text-gray-600">{{ item.coordenadorNome || '—' }}</td>
            <td class="px-6 py-4">
              <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', item.ativo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
                {{ item.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button :data-testid="'edit-curso-' + item.nome" class="text-gray-400 hover:text-[#399c3c] mr-3 transition-colors" @click="openEdit(item)">
                <Pencil class="w-4 h-4" />
              </button>
              <button :data-testid="'delete-curso-' + item.nome" class="text-gray-400 hover:text-red-600 transition-colors" @click="openDelete(item)">
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && itens.length === 0" class="p-8 text-center text-gray-500 text-sm">
        Nenhum curso encontrado.
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="modalOpen = false"
      @keydown.escape="modalOpen = false"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ isEdit ? 'Editar Curso' : 'Novo Curso' }}</h2>

        <div v-if="formError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ formError }}
        </div>

        <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Curso *</label>
        <input
          v-model="form.nome"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Ex: Tecnologia em Análise e Desenvolvimento de Sistemas"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Campus *</label>
        <select
          v-model="form.campusId"
          data-testid="select-campus"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
        >
          <option value="" disabled>Selecione o campus</option>
          <option v-for="c in campuses" :key="c.id" :value="c.id">{{ c.nome }} ({{ c.sigla }})</option>
        </select>

        <label class="block text-sm font-medium text-gray-700 mb-1">Grau *</label>
        <select
          v-model="form.grauId"
          data-testid="select-grau"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
        >
          <option value="" disabled>Selecione o grau</option>
          <option v-for="g in graus" :key="g.id" :value="g.id">{{ g.nome }}</option>
        </select>

        <label class="block text-sm font-medium text-gray-700 mb-1">Email da Coordenação *</label>
        <input
          v-model="form.emailCoordenacao"
          type="email"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="exemplo@poa.ifrs.edu.br"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Carga Horária AC Exigida *</label>
        <input
          v-model.number="form.cargaHorariaAcExigida"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Ex: 180"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Coordenador</label>
        <select
          v-model="form.coordenadorId"
          data-testid="select-coordenador"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
        >
          <option :value="null">Nenhum</option>
          <option v-for="u in coordenadores" :key="u.id" :value="u.id">{{ u.nome }}</option>
        </select>

        <label class="flex items-center gap-2 text-sm text-gray-700 mb-6">
          <input v-model="form.ativo" type="checkbox" class="rounded border-gray-300" />
          Ativo
        </label>

        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            @click="modalOpen = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-[#399c3c] text-white rounded-lg text-sm font-medium hover:bg-[#195128] transition-colors disabled:opacity-50"
            @click="saveForm"
            :disabled="saving"
          >
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Delete Confirmation -->
    <div
      v-if="deleteModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="deleteModalOpen = false"
      @keydown.escape="deleteModalOpen = false"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">Confirmar desativação</h2>
        <p class="text-sm text-gray-600 mb-6">
          Tem certeza que deseja desativar o curso
          <strong>'{{ deletingItem?.nome }}'</strong>?
        </p>
        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            @click="deleteModalOpen = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            @click="confirmDelete"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
