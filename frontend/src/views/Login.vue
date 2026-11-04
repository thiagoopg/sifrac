<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { setUser } from '@/lib/auth'
import { BookOpen } from 'lucide-vue-next'

const router = useRouter()

const loginLdap = ref('')
const senha = ref('')
const loading = ref(false)
const error = ref('')

async function auth() {
  error.value = ''

  if (!loginLdap.value.trim()) {
    error.value = 'Informe o login LDAP'
    return
  }

  if (!senha.value) {
    error.value = 'Informe a senha'
    return
  }

  loading.value = true

  try {
    const formData = new URLSearchParams()

    formData.append('username', loginLdap.value.trim())
    formData.append('password', senha.value)

    // Spring Security autentica o usuário via LDAP.
    await api.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    // Busca os dados do usuário autenticado pela sessão.
    const usuarioResponse = await api.get('/usuarios/me')

    setUser(usuarioResponse.data)

    await router.push('/dashboard')
  } catch (e) {
    if (e.response?.status === 401) {
      error.value = 'Login ou senha inválidos'
    } else if (e.response?.status === 403) {
      error.value = 'Usuário sem permissão para acessar o sistema'
    } else {
      error.value = 'Erro ao autenticar. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
      class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4"
  >
    <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md p-8"
    >
      <!-- Cabeçalho -->
      <div class="text-center mb-8">
        <div
            class="w-14 h-14 bg-[#399c3c] rounded-xl flex items-center justify-center mx-auto mb-4"
        >
          <BookOpen class="w-7 h-7 text-white" />
        </div>

        <h1 class="text-2xl font-bold text-gray-900">
          HComplementares
        </h1>

        <p class="text-gray-500 text-sm mt-1">
          IFRS — Sistema de Horas Complementares
        </p>
      </div>

      <!-- Formulário -->
      <form @submit.prevent="auth" class="space-y-4">

        <!-- Login LDAP -->
        <div>
          <label
              for="login"
              class="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Login LDAP
          </label>

          <input
              id="login"
              v-model="loginLdap"
              type="text"
              autocomplete="username"
              placeholder="Digite seu login"
              data-testid="login-input"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                   focus:ring-2 focus:ring-[#399c3c]
                   focus:border-transparent
                   outline-none transition-all"
          />
        </div>

        <!-- Senha -->
        <div>
          <label
              for="senha"
              class="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Senha
          </label>

          <input
              id="senha"
              v-model="senha"
              type="password"
              autocomplete="current-password"
              placeholder="Digite sua senha"
              data-testid="password-input"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                   focus:ring-2 focus:ring-[#399c3c]
                   focus:border-transparent
                   outline-none transition-all"
          />

          <p class="mt-1.5 text-xs text-gray-500">
            O login é o mesmo usado no Moodle.
          </p>
        </div>

        <!-- Erro -->
        <div
            v-if="error"
            class="p-3 bg-red-50 text-red-600 text-sm rounded-lg"
        >
          {{ error }}
        </div>

        <!-- Botão -->
        <button
            type="submit"
            :disabled="loading"
            data-testid="login-button"
            class="w-full bg-[#399c3c] hover:bg-[#195128]
                 text-white font-medium py-2.5 rounded-lg
                 text-sm transition-colors
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>