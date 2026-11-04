<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { useAuth, PERFIS } from '@/lib/auth'

const { cursoId, perfil, campusId } = useAuth()
const isCampusAdmin = computed(() => perfil.value === PERFIS.ADMIN_CAMPUS)

const itens = ref([])
const loading = ref(true)
const cursos = ref([])

// Modal create/edit
const modalOpen = ref(false)
const editingId = ref(null)
const form = ref({ nome: '', descricao: '', cargaHorariaMaxima: null, cursoId: null, ativo: true })
const formError = ref('')
const saving = ref(false)

// Modal delete
const deleteModalOpen = ref(false)
const deletingItem = ref(null)

const isEdit = computed(() => editingId.value !== null)

async function loadData() {
  loading.value = true
  try {
    const tiposParams = cursoId.value
      ? { cursoId: cursoId.value }
      : (isCampusAdmin.value && campusId.value ? { campusId: campusId.value } : {})
    const cursosParams = isCampusAdmin.value && campusId.value ? { campusId: campusId.value } : {}
    const [tipoRes, cursoRes] = await Promise.all([
      api.get('/tipos-hora', { params: tiposParams }),
      api.get('/cursos', { params: cursosParams })
    ])
    itens.value = tipoRes.data
    cursos.value = cursoRes.data.filter(c => c.ativo)
  } finally {
    loading.value = false
  }
}

function openNew() {
  editingId.value = null
  form.value = { nome: '', descricao: '', cargaHorariaMaxima: null, cursoId: cursoId.value || null, ativo: true }
  formError.value = ''
  modalOpen.value = true
}

function openEdit(item) {
  editingId.value = item.id
  form.value = {
    nome: item.nome,
    descricao: item.descricao || '',
    cargaHorariaMaxima: item.cargaHorariaMaxima,
    cursoId: item.cursoId,
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
  if (!form.value.nome || !form.value.cargaHorariaMaxima || !form.value.cursoId) {
    formError.value = 'Preencha nome, carga horária máxima e curso.'
    return
  }
  saving.value = true
  try {
    const body = {
      nome: form.value.nome,
      descricao: form.value.descricao || null,
      cargaHorariaMaxima: form.value.cargaHorariaMaxima,
      cursoId: form.value.cursoId
    }
    if (isEdit.value) {
      await api.put(`/tipos-hora/${editingId.value}`, body)
    } else {
      await api.post('/tipos-hora', body)
    }
    modalOpen.value = false
    await loadData()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Erro ao salvar tipo de hora.'
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  try {
    await api.delete(`/tipos-hora/${deletingItem.value.id}`)
    deleteModalOpen.value = false
    await loadData()
  } catch (err) {
    console.error('Erro ao desativar:', err)
  }
}

onMounted(loadData)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tipos de Hora Complementar</h1>
      <button
        data-testid="botao-novo-tipo"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#399c3c] hover:bg-[#195128] text-white rounded-lg text-sm font-medium transition-colors"
        @click="openNew"
      >
        <Plus class="w-4 h-4" />
        Novo Tipo
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin w-6 h-6 border-2 border-green-200 border-t-[#399c3c] rounded-full mx-auto" />
      </div>
      <table v-else class="w-full text-sm" data-testid="tabela-tipos-hora">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carga Máx</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="item in itens" :key="item.id" class="hover:bg-gray-50" :data-testid="'tipo-' + item.nome">
            <td class="px-6 py-4 font-medium text-gray-900">{{ item.nome }}</td>
            <td class="px-6 py-4 text-gray-600 max-w-xs truncate">{{ item.descricao || '—' }}</td>
            <td class="px-6 py-4 text-gray-800 font-medium">{{ item.cargaHorariaMaxima }}h</td>
            <td class="px-6 py-4 text-gray-600">{{ item.cursoNome }}</td>
            <td class="px-6 py-4">
              <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', item.ativo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
                {{ item.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button :data-testid="'edit-tipo-' + item.nome" class="text-gray-400 hover:text-[#399c3c] mr-3 transition-colors" @click="openEdit(item)">
                <Pencil class="w-4 h-4" />
              </button>
              <button :data-testid="'delete-tipo-' + item.nome" class="text-gray-400 hover:text-red-600 transition-colors" @click="openDelete(item)">
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && itens.length === 0" class="p-8 text-center text-gray-500 text-sm">
        Nenhum tipo de hora cadastrado para este curso.
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="modalOpen = false"
      @keydown.escape="modalOpen = false"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ isEdit ? 'Editar Tipo de Hora' : 'Novo Tipo de Hora' }}</h2>

        <div v-if="formError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ formError }}
        </div>

        <label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          v-model="form.nome"
          type="text"
          data-testid="input-nome-tipo"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Ex: Monitoria"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          v-model="form.descricao"
          data-testid="input-descricao-tipo"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3 min-h-[70px]"
          placeholder="Descrição do tipo de hora..."
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Carga Horária Máxima (h) *</label>
        <input
          v-model.number="form.cargaHorariaMaxima"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Ex: 120"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Curso *</label>
        <select
          v-model="form.cursoId"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          :disabled="!!cursoId"
        >
          <option value="" disabled>Selecione o curso</option>
          <option v-for="c in cursos" :key="c.id" :value="c.id">{{ c.nome }}</option>
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
          Tem certeza que deseja desativar o tipo de hora
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
