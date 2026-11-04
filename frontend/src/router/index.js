import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'
import CampusAdmins from '@/views/CampusAdmins.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { pageName: 'Dashboard' }
      },
      {
        path: 'campus',
        name: 'Campus',
        component: () => import('@/views/Campus.vue'),
        meta: { pageName: 'Campus' }
      },
      {
        path: 'cursos',
        name: 'Cursos',
        component: () => import('@/views/Cursos.vue'),
        meta: { pageName: 'Cursos' }
      },
      {
        path: 'alunos',
        name: 'Alunos',
        component: () => import('@/views/Alunos.vue'),
        meta: { pageName: 'Alunos' }
      },
      {
        path: 'solicitacoes',
        name: 'Solicitacoes',
        component: () => import('@/views/Solicitacoes.vue'),
        meta: { pageName: 'Solicitacoes' }
      },
      {
        path: 'solicitacoes/:id/audit',
        name: 'Audit',
        component: () => import('@/views/Audit.vue'),
        meta: { pageName: 'Solicitacoes' }
      },
      {
        path: 'tipos-hora',
        name: 'TiposHora',
        component: () => import('@/views/TiposHora.vue'),
        meta: { pageName: 'TiposHora' }
      },
      {
        path: 'usuarios',
        name: 'Usuarios',
        component: () => import('@/views/Usuarios.vue'),
        meta: { pageName: 'Usuarios' }
      },
      {
        path: 'admin-campus',
        name: 'AdminCampus',
        component: CampusAdmins,
        meta: { pageName: 'AdminCampus' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Permissões de interface por página
const permissoes = {
  Dashboard: [
    'ADMINISTRADOR',
    'ADMIN_CAMPUS',
    'COORDENADOR',
    'ALUNO'
  ],
  Campus: ['ADMINISTRADOR', 'ADMIN_CAMPUS'],
  Cursos: ['ADMINISTRADOR', 'ADMIN_CAMPUS', 'COORDENADOR'],
  Alunos: ['ADMINISTRADOR'],
  Solicitacoes: [
    'ADMINISTRADOR',
    'ADMIN_CAMPUS',
    'COORDENADOR',
    'ALUNO'
  ],
  TiposHora: ['ADMINISTRADOR', 'ADMIN_CAMPUS', 'COORDENADOR'],
  Usuarios: ['ADMINISTRADOR'],
  AdminCampus: ['ADMINISTRADOR', 'ADMIN_CAMPUS']
}

// Guarda global de navegação
router.beforeEach((to) => {
  // Login é uma rota pública
  if (to.name === 'Login') {
    return true
  }

  // Verifica a existência do usuário salvo
  const raw = localStorage.getItem('usuario')

  if (!raw) {
    return { name: 'Login' }
  }

  let user

  try {
    user = JSON.parse(raw)
  } catch (error) {
    // Remove dados inválidos de autenticação local
    localStorage.removeItem('usuario')
    return { name: 'Login' }
  }

  // Identifica a página e a permissão necessária
  const requiredPage = to.matched
    .find(route => route.meta?.pageName)
    ?.meta?.pageName

  const perfisPermitidos = permissoes[requiredPage]

  // Valida o perfil para a página solicitada
  if (
    perfisPermitidos &&
    !perfisPermitidos.includes(user?.perfil)
  ) {
    // Evita redirecionar para a própria página indefinidamente
    if (to.name !== 'Dashboard') {
      return { name: 'Dashboard' }
    }

    return false
  }

  // Permite a navegação
  return true
})

export default router