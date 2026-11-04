<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  Building2, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Clock, 
  Users, 
  LogOut, 
  Menu, 
  Bell, 
  Check 
} from 'lucide-vue-next'
import api from '@/services/api'
import { useAuth, RotasPorPerfil, PERFIS } from '@/lib/auth'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

// ── Referências do DOM para o Vue 3 (Template Refs) ──────────────────────────
const notifDropdownRef = ref(null)
const notifBtnRef = ref(null)

// ── Composable de autenticação ──────────────────────────────────────────────
const { user, perfil, usuarioId, isAdministrador, logout: fazerLogout } = useAuth()

// Estado das Notificações
const notifications = ref([])
const unreadCount = ref(0)
const notifDropdownOpen = ref(false)

async function fetchNotifications() {
  if (!usuarioId.value) return
  try {
    const [notifsRes, countRes] = await Promise.all([
      api.get('/notificacoes', { params: { usuarioId: usuarioId.value } }),
      api.get('/notificacoes/nao-lidas/count', { params: { usuarioId: usuarioId.value } })
    ])
    notifications.value = notifsRes.data || []
    unreadCount.value = countRes.data || 0
  } catch (e) {
    console.error('Erro ao buscar notificações', e)
  }
}

async function marcarComoLida(notifId) {
  if (!usuarioId.value) return
  try {
    await api.put(`/notificacoes/${notifId}/marcar-lida`, null, { params: { usuarioId: usuarioId.value } })
    notifications.value = notifications.value.map(n =>
      n.id === notifId ? { ...n, lida: true } : n
    )
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  } catch (e) {
    console.error('Erro ao marcar como lida', e)
  }
}

async function marcarTodasComoLidas() {
  if (!usuarioId.value) return
  try {
    await api.put('/notificacoes/marcar-todas-lidas', null, { params: { usuarioId: usuarioId.value } })
    notifications.value = notifications.value.map(n => ({ ...n, lida: true }))
    unreadCount.value = 0
  } catch (e) {
    console.error('Erro ao marcar todas como lidas', e)
  }
}

onMounted(fetchNotifications)

// Recarrega notificações ao mudar de rota
watch(() => route.path, fetchNotifications)

// Trava a rolagem da página quando o menu mobile estiver aberto (Scroll Lock)
watch(sidebarOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

// Verifica permissão com base no perfil
function podeVerItem (nome) {
  const allowList = RotasPorPerfil[perfil.value]
  if (!allowList) return false
  return allowList.includes(nome)
}

const menuItems = computed(() => [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', nome: 'Dashboard' },
  { path: '/campus', icon: Building2, label: 'Campus', nome: 'Campus' },
  { path: '/cursos', icon: BookOpen, label: 'Cursos', nome: 'Cursos' },
  { path: '/alunos', icon: GraduationCap, label: 'Alunos', nome: 'Alunos' },
  { path: '/solicitacoes', icon: FileText, label: 'Solicitações', nome: 'Solicitacoes' },
  { path: '/tipos-hora', icon: Clock, label: 'Tipos de Hora', nome: 'TiposHora' },
  { path: '/usuarios', icon: Users, label: 'Usuários', nome: 'Usuarios' },
].filter(item => podeVerItem(item.nome)))

function logout () {
  fazerLogout()
  router.push('/login')
}

function perfilClass (p) {
  if (p === PERFIS.ADMINISTRADOR) return 'bg-red-100 text-red-700'
  if (p === PERFIS.COORDENADOR) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

function formatarTempo (criadoEm) {
  if (!criadoEm) return ''
  const now = new Date()
  const created = new Date(criadoEm)
  const diffMs = now - created
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `${diffMin}min atrás`
  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `${diffHrs}h atrás`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays < 7) return `${diffDays}d atrás`
  return created.toLocaleDateString('pt-BR')
}

// Manipulação declarativa via Template Refs
function handleOutsideClick (e) {
  const isOutsideDropdown = notifDropdownRef.value && !notifDropdownRef.value.contains(e.target)
  const isOutsideButton = notifBtnRef.value && !notifBtnRef.value.contains(e.target)
  
  if (isOutsideDropdown && isOutsideButton) {
    notifDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Overlay Mobile -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black/50 z-20 lg:hidden" 
      @click="sidebarOpen = false" 
    />

    <!-- Sidebar Lateral -->
    <aside 
      :class="[
        'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#195128] border-r border-[rgba(255,255,255,0.15)] transform transition-transform duration-200 lg:translate-x-0', 
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-6 border-b border-[rgba(255,255,255,0.15)]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-[#399c3c] rounded-lg flex items-center justify-center">
            <BookOpen class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-base font-bold text-white">HComplementares</h1>
            <p class="text-xs text-green-200">IFRS — Porto Alegre</p>
          </div>
        </div>
      </div>

      <nav class="p-3 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="sidebarOpen = false"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-green-100 hover:bg-white/10 hover:text-white transition-colors"
          :class="{ 'bg-white/15 text-white': route.path === item.path }"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-sm font-medium">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(255,255,255,0.15)]">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-full bg-[#399c3c] flex items-center justify-center text-white font-bold text-sm">
            {{ user?.nome?.charAt(0) || 'U' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ user?.nome }}</p>
            <p class="text-xs text-green-200">{{ user?.perfil }}</p>
          </div>
        </div>
        <button 
          @click="logout" 
          class="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <LogOut class="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>

    <!-- Conteúdo Principal -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <button @click="sidebarOpen = true" class="lg:hidden p-2 rounded-lg hover:bg-gray-100">
          <Menu class="w-5 h-5 text-gray-600" />
        </button>
        <h2 class="text-lg font-semibold text-gray-800 hidden lg:block">{{ $route.name }}</h2>
        
        <div class="flex items-center gap-3">
          <!-- Botão e Dropdown de Notificações -->
          <div class="relative" ref="notifBtnRef">
            <button
              @click="notifDropdownOpen = !notifDropdownOpen"
              class="p-2 rounded-lg hover:bg-gray-100 relative transition-colors"
            >
              <Bell class="w-5 h-5 text-gray-600" :class="{ 'text-[#399c3c]': unreadCount > 0 }" />
              <span
                v-if="unreadCount > 0"
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-5 flex items-center justify-center rounded-full bg-[#ca1e25] text-white text-[10px] font-bold px-1"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <!-- Dropdown -->
            <div
              v-show="notifDropdownOpen"
              ref="notifDropdownRef"
              class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
            >
              <!-- Cabeçalho -->
              <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-800">Notificações</h3>
                <button
                  v-if="unreadCount > 0"
                  @click="marcarTodasComoLidas()"
                  class="text-xs text-[#399c3c] hover:text-[#195128] flex items-center gap-1 transition-colors"
                >
                  <Check class="w-3 h-3" />
                  Marcar todas como lidas
                </button>
              </div>

              <!-- Lista -->
              <div class="max-h-80 overflow-y-auto">
                <div v-if="notifications.length === 0" class="p-8 text-center">
                  <Bell class="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p class="text-sm text-gray-500">Nenhuma notificação</p>
                </div>

                <div
                  v-for="notif in notifications"
                  :key="notif.id"
                  @click="marcarComoLida(notif.id)"
                  class="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                  :class="{ 'bg-green-50/50': !notif.lida }"
                >
                  <div class="flex items-start gap-3">
                    <div class="w-2 h-2 rounded-full mt-2 flex-shrink-0" :class="notif.lida ? 'bg-gray-300' : 'bg-[#399c3c]'" />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900">{{ notif.titulo }}</p>
                      <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ notif.mensagem }}</p>
                      <p class="text-xs text-gray-400 mt-1">{{ formatarTempo(notif.criadoEm) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Rodapé -->
              <div v-if="notifications.length > 0" class="px-4 py-2 border-t border-gray-100 text-center">
                <router-link
                  to="/solicitacoes"
                  @click="notifDropdownOpen = false"
                  class="text-xs text-[#399c3c] hover:text-[#195128] transition-colors"
                >
                  Ver todas as solicitações
                </router-link>
              </div>
            </div>
          </div>

          <span :class="['px-3 py-1 rounded-full text-xs font-medium', perfilClass(perfil)]">
            {{ perfil }}
          </span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>