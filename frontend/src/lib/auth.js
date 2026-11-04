import { ref, computed } from 'vue'

/**
 * Chave usada no localStorage para armazenar o usuário autenticado.
 */
const STORAGE_KEY = 'usuario'

/**
 * Perfil do usuário atual como estado reativo.
 * Atualiza automaticamente quando o storage é modificado (login/logout).
 */
const userRef = ref(null)

function loadUser () {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    userRef.value = null
    return null
  }
  try {
    const parsed = JSON.parse(raw)
    userRef.value = parsed
    return parsed
  } catch {
    userRef.value = null
    return null
  }
}

// Carrega o usuário atual na inicialização
loadUser()

// Mantém a reatividade sincronizada com o localStorage
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) loadUser()
})

// Força recarregamento do usuário (para testes e cenários where storage event não dispara)
export function forceLoadUser() {
  return loadUser()
}

export function setUser (usuario) {
  if (!usuario) {
    localStorage.removeItem(STORAGE_KEY)
    userRef.value = null
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario))
  userRef.value = usuario
}

// Expor globalmente para testes
if (typeof window !== 'undefined') {
  window.__forceLoadUser = forceLoadUser
}

/**
 * Composable de autenticação — padrão Vue 3 Composition API.
 *
 * Uso nos componentes:
 *   const { user, perfil, isAdministrador, podeAcessar } = useAuth()
 *
 * Propriedades reativas:
 *   user       – objeto completo do usuário ou null
 *   perfil     – string do perfil (ADMINISTRADOR, ADMIN_CAMPUS, COORDENADOR, ALUNO)
 *   usuarioId  – id do usuário ou null
 *   cursoId    – id do curso vinculado ou null
 *   cursoNome  – nome do curso ou null
 *   campusId   – id do campus (para ADMIN_CAMPUS) ou null
 *   campusNome – nome do campus ou null
 *
 * Funções:
 *   podeAcessar(nomeRota)   – verifica se o perfil tem acesso à rota
 *   isAdmin()               – é administrador?
 *   isCoordenador()         – é coordenador de curso?
 *   isAdminCampus()         – é admin de campus?
 *   logout()                – remove o usuário do localStorage
 */
export function useAuth () {
  const user = computed(() => userRef.value)
  const perfil = computed(() => userRef.value?.perfil ?? null)
  const usuarioId = computed(() => userRef.value?.id ?? null)
  const cursoId = computed(() => userRef.value?.cursoId ?? null)
  const cursoNome = computed(() => userRef.value?.cursoNome ?? null)
  const campusId = computed(() => userRef.value?.campusId ?? null)
  const campusNome = computed(() => userRef.value?.campusNome ?? null)

  const isAdministrador = computed(() => perfil.value === PERFIS.ADMINISTRADOR)
  const isAdminCampus = computed(() => perfil.value === PERFIS.ADMIN_CAMPUS)
  const isCoordenador = computed(() => perfil.value === PERFIS.COORDENADOR)
  const isLoggedIn = computed(() => userRef.value !== null)

  function podeAcessar (nomeRota) {
    const allowList = RotasPorPerfil[perfil.value]
    if (!allowList) return false
    return allowList.includes(nomeRota)
  }

  function logout () {
    localStorage.removeItem(STORAGE_KEY)
    loadUser()
  }

  return {
    // Estado reativo
    user,
    perfil,
    usuarioId,
    cursoId,
    cursoNome,
    campusId,
    campusNome,
    isAdministrador,
    isAdminCampus,
    isCoordenador,
    isLoggedIn,
    // Funções
    podeAcessar,
    logout
  }
}

// ─── Funções compatíveis com a versão anterior (mantidas para backward compat.) ───

export function usuarioLogado () {
  return loadUser()
}

export function podeAcessar (nomeRota) {
  const p = userRef.value?.perfil
  if (!p) return false
  const allowList = RotasPorPerfil[p]
  if (!allowList) return false
  return allowList.includes(nomeRota)
}

export function perfilDoUsuario () {
  return userRef.value?.perfil ?? null
}

export function usuarioTemPerfil (perfilDesejado) {
  return userRef.value?.perfil === perfilDesejado
}

export function getCampusId () {
  return userRef.value?.campusId ?? null
}

export function getCampusNome () {
  return userRef.value?.campusNome ?? null
}

// ─── Constantes ─────────────────────────────────────────────────────────────────

export const PERFIS = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  ADMIN_CAMPUS: 'ADMIN_CAMPUS',
  COORDENADOR: 'COORDENADOR',
  ALUNO: 'ALUNO'
}

export const RotasPorPerfil = {
  [PERFIS.ADMINISTRADOR]: [
    'Dashboard', 'Campus', 'Cursos', 'Alunos', 'Solicitacoes', 'TiposHora', 'Usuarios'
  ],
  [PERFIS.ADMIN_CAMPUS]: [
    'Dashboard', 'Campus', 'Cursos', 'TiposHora', 'Solicitacoes'
  ],
  [PERFIS.COORDENADOR]: [
    'Dashboard', 'Cursos', 'Solicitacoes'
  ],
  [PERFIS.ALUNO]: [
    'Dashboard', 'Solicitacoes'
  ]
}
