<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import api from '@/services/api'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { useAuth, PERFIS } from '@/lib/auth'

const itens = ref([])
const loading = ref(true)
const busca = ref('')

const itensFiltrados = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  if (!termo) return itens.value
  return itens.value.filter(u =>
    [u.nome, u.email, u.loginLdap]
      .filter(Boolean)
      .some(valor => String(valor).toLowerCase().includes(termo))
  )
})

// Modal create/edit
const modalOpen = ref(false)
const editingId = ref(null)
const form = ref({ nome: '', email: '', loginLdap: '', perfil: PERFIS.ALUNO })
const formError = ref('')
const saving = ref(false)
const toggleAtivo = ref(true)

// Modal delete
const deleteModalOpen = ref(false)
const deletingItem = ref(null)
const deleteError = ref('')
const deleting = ref(false)

const isEdit = ref(false)

// Novo: filtro por campus para admins de campus
const { perfil: currentPerfil, campusId } = useAuth()
const isCampusAdmin = computed(() => currentPerfil.value === PERFIS.ADMIN_CAMPUS)
const campusFilter = computed(() => isCampusAdmin.value ? campusId.value : null)

async function loadItems() {
  loading.value = true
  try {
    const res = await api.get(`/usuarios?campusId=${campusFilter.value}`)
    itens.value = res.data
  } finally {
    loading.value = false
  }
}

function openNew() {
  editingId.value = null
  isEdit.value = false
  form.value = { nome: '', email: '', loginLdap: '', perfil: PERFIS.ALUNO }
  toggleAtivo.value = true
  formError.value = ''
  modalOpen.value = true
}

function openEdit(item) {
  editingId.value = item.id
  isEdit.value = true
  form.value = { nome: item.nome, email: item.email, loginLdap: item.loginLdap, perfil: item.perfil }
  toggleAtivo.value = item.ativo
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
  if (!form.value.nome || !form.value.email || !form.value.loginLdap || !form.value.perfil) {
    formError.value = 'Preencha todos os campos obrigatórios.'
    return
  }
  saving.value = true
  try {
    const body = { ...form.value, ativo: toggleAtivo.value }
    if (isEdit.value) {
      await api.put(`/usuarios/${editingId.value}`, body)
    } else {
      await api.post('/usuarios', body)
    }
    modalOpen.value = false
    await loadItems()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Erro ao salvar usuário.'
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  deleteError.value = ''
  if (!deletingItem.value) return
  deleting.value = true
  try {
    const item = deletingItem.value
    const body = {
      nome: item.nome,
      email: item.email,
      loginLdap: item.loginLdap,
      perfil: item.perfil,
      campusId: item.campusId ?? null,
      ativo: false,
    }
    await api.put(`/usuarios/${item.id}`, body)
    deleteModalOpen.value = false
    await loadItems()
  } catch (err) {
    deleteError.value = err.response?.data?.message || 'Erro ao desativar usuário.'
  } finally {
    deleting.value = false
  }
}

onMounted(loadItems)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Usuários</h1>
      <input
        v-model="busca"
        type="search"
        data-testid="busca-usuario"
        placeholder="Buscar usuário..."
        class="w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c]"
      />
      <button
        data-testid="botao-novo-usuario"
        class="inline-flex items-center gap-2 px-4 py-2 bg-[#399c3c] hover:bg-[#195128] text-white rounded-lg text-sm font-medium transition-colors"
        @click="openNew"
      >
        <Plus class="w-4 h-4" />
        Novo Usuário
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin w-6 h-6 border-2 border-green-200 border-t-[#399c3c] rounded-full mx-auto" />
      </div>
      <table v-else class="w-full text-sm" data-testid="tabela-usuarios">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login LDAP</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="item in itensFiltrados" :key="item.id" class="hover:bg-gray-50" :data-testid="'usuario-' + item.loginLdap">
            <td class="px-6 py-4 font-medium text-gray-900">{{ item.nome }}</td>
            <td class="px-6 py-4 text-gray-600">{{ item.email }}</td>
            <td class="px-6 py-4 font-mono text-xs text-gray-600">{{ item.loginLdap }}</td>
            <td class="px-6 py-4">
              <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', {
                'bg-red-50 text-red-700': item.perfil === PERFIS.ADMINISTRADOR,
                'bg-yellow-50 text-yellow-700': item.perfil === PERFIS.COORDENADOR,
                'bg-green-50 text-green-700': item.perfil === PERFIS.ALUNO
              }]">
                {{ item.perfil }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span v-if="isCampusAdmin" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700">
                {{ item.campusNome || 'N/A' }}
              </span>
              <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-gray-400">—</span>
            </td>
            <td class="px-6 py-4">
              <span :class="['inline-flex items-center px-2.5 py-1 rounded-font-medium text-sm text-gray-500']">
                {{ item.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button :data-testid="'edit-usuario-' + item.loginLdap" class="text-gray-400 hover:text-[#399c3c] mr-3 transition-colors" @click="openEdit(item)">
                <Pencil class="w-4 h-4" />
              </button>
              <button :data-testid="'delete-usuario-' + item.loginLdap" class="text-gray-400 hover:text-red-600 transition-colors" @click="openDelete(item)">
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && itensFiltrados.length === 0" class="p-8 text-center text-gray-500 text-sm">
        Nenhum usuário encontrado.
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
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}</h2>

        <div v-if="formError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {{ formError }}
        </div>

        <label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          v-model="form.nome"
          type="text"
          data-testid="input-nome"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="Nome completo"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          v-model="form.email"
          type="email"
          data-testid="input-email"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="email@iftrs.edu.br"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Login LDAP *</label>
        <input
          v-model="form.loginLdap"
          type="text"
          data-testid="input-login-ldap"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
          placeholder="login.ldap"
        />

        <label class="block text-sm font-medium text-gray-700 mb-1">Perfil *</label>
        <select
          v-model="form.perfil"
          data-testid="select-perfil"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#399c3c] mb-3"
        >
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="COORDENADOR">Coordenador</option>
          <option value="ALUNO">Aluno</option>
        </select>

        <label class="flex items-center gap-2 text-sm text-gray-700 mb-6">
          <input v-model="toggleAtivo" type="checkbox" class="rounded border-gray-300" />
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
          Tem certeza que deseja desativar o usuário
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
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            :disabled="deleting"
            @click="confirmDelete"
          >
            {{ deleting ? 'Desativando...' : 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
