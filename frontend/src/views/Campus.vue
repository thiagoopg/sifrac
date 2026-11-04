<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuth } from '@/lib/auth'
import { Plus, Pencil, Trash2, Building2, MapPin } from 'lucide-vue-next'

const { isAdministrador } = useAuth()

const itens = ref([])
const loading = ref(true)

// Modal create/edit
const modalOpen = ref(false)
const editingId = ref(null)
const form = ref({ nome: '', sigla: '', cidade: '', uf: '', ativo: true })
const formError = ref('')

// Modal delete
const deleteModalOpen = ref(false)
const deletingItem = ref(null)
const deleteError = ref('')

const isEdit = computed(() => editingId.value !== null)

function openNew() {
  editingId.value = null
  form.value = { nome: '', sigla: '', cidade: '', uf: '', ativo: true }
  formError.value = ''
  modalOpen.value = true
}

function openEdit(item) {
  editingId.value = item.id
  form.value = { nome: item.nome, sigla: item.sigla, cidade: item.cidade, uf: item.uf, ativo: item.ativo }
  formError.value = ''
  modalOpen.value = true
}

function openDelete(item) {
  deletingItem.value = item
  deleteError.value = ''
  deleteModalOpen.value = true
}

async function saveForm() {
  formError.value = ''
  try {
    if (isEdit.value) {
      await api.put(`/campuses/${editingId.value}`, form.value)
    } else {
      await api.post('/campuses', form.value)
    }
    modalOpen.value = false
    await loadItems()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Erro ao salvar campus.'
  }
}

async function confirmDelete() {
  deleteError.value = ''
  try {
    await api.delete(`/campuses/${deletingItem.value.id}`)
    deleteModalOpen.value = false
    await loadItems()
  } catch (err) {
    deleteError.value = err.response?.data?.message || 'Erro ao excluir campus.'
  }
}

async function loadItems() {
  loading.value = true
  try {
    const res = await api.get('/campuses')
    itens.value = res.data
  } finally {
    loading.value = false
  }
}

function closeModals() {
  modalOpen.value = false
  deleteModalOpen.value = false
}

onMounted(loadItems)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Campi</h1>
      <button
        v-if="isAdministrador"
        data-testid="botao-novo-campus"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#399c3c] hover:bg-[#195128] text-white rounded-lg text-sm font-medium transition-colors"
        @click="openNew"
      >
        <Plus class="w-4 h-4" />
        Novo Campus
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin w-6 h-6 border-2 border-green-200 border-t-[#399c3c] rounded-full mx-auto" />
      </div>
      <table v-else class="w-full text-sm" data-testid="tabela-campus">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sigla</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UF</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="item in itens" :key="item.id" class="hover:bg-gray-50" :data-testid="'campus-' + item.nome">
            <td class="px-6 py-4 font-mono text-gray-600">{{ item.sigla }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ item.nome }}</td>
            <td class="px-6 py-4 text-gray-600">{{ item.cidade }}</td>
            <td class="px-6 py-4 text-gray-600">{{ item.uf }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                  item.ativo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="item.ativo ? 'bg-green-500' : 'bg-red-500'"></span>
                {{ item.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button
                :data-testid="'edit-campus-' + item.nome"
                class="text-gray-400 hover:text-[#399c3c] mr-3 transition-colors"
                @click="openEdit(item)"
              >
                <Pencil class="w-4 h-4" />
              </button>
              <button
                v-if="isAdministrador"
                :data-testid="'delete-campus-' + item.nome"
                class="text-gray-400 hover:text-red-600 transition-colors"
                @click="openDelete(item)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Create/Edit -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModals"
      @keydown.escape="closeModals"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          {{ isEdit ? 'Editar Campus' : 'Novo Campus' }}
        </h2>

        <div v-if="formError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ formError }}
        </div>

        <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input
          v-model="form.nome"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Nome do campus"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Sigla</label>
        <input
          v-model="form.sigla"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Sigla"
          maxlength="5"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
        <input
          v-model="form.cidade"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Cidade"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">UF</label>
        <input
          v-model="form.uf"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="UF"
          maxlength="2"
        />

        <label class="flex items-center gap-2 text-sm text-gray-700 mb-6">
          <input v-model="form.ativo" type="checkbox" class="rounded border-gray-300" />
          Ativo
        </label>

        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            @click="closeModals"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-[#399c3c] text-white rounded-lg text-sm font-medium hover:bg-[#195128] transition-colors"
            @click="saveForm"
          >
            Salvar
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
        <h2 class="text-lg font-semibold text-gray-900 mb-2">Confirmar exclusão</h2>
        <p class="text-sm text-gray-600 mb-6">
          Tem certeza que deseja desativar o campus
          <strong>'{{ deletingItem?.nome }}'</strong>?
        </p>

        <div v-if="deleteError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ deleteError }}
        </div>

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
