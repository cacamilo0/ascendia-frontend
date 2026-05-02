<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <!-- Logo / Marca -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-white tracking-tight">Ascendia</h1>
        <p class="text-gray-400 mt-2 text-sm">Prepárate para el Saber Pro</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8">

        <h2 class="text-lg font-semibold text-white mb-6">Iniciar sesión</h2>

        <!-- Error global -->
        <div v-if="error" class="mb-5 px-4 py-3 bg-red-950 border border-red-800 rounded-lg">
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>

        <!-- Formulario -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1.5">Correo electrónico</label>
            <input
                v-model="email"
                type="email"
                placeholder="usuario@correo.com"
                autocomplete="email"
                :disabled="loading"
                @keyup.enter="handleLogin"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-1.5">Contraseña</label>
            <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                :disabled="loading"
                @keyup.enter="handleLogin"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            />
          </div>

          <button
              @click="handleLogin"
              :disabled="loading || !email || !password"
              class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg py-2.5 text-sm transition-colors mt-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <span v-if="loading">Ingresando...</span>
            <span v-else>Ingresar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useTestStore } from '../stores/test.js'
import { login } from '../api/auth.js'
import { startTest, getQuestions } from '../api/test.js'

const router = useRouter()
const auth = useAuthStore()
const test = useTestStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function handleLogin() {
  if (loading.value || !email.value || !password.value) return

  loading.value = true
  error.value = null

  try {
    // 1. Login
    const { userId } = await login(email.value, password.value)
    auth.setUser(userId, email.value)

    // 2. Iniciar test
    const { sessionId } = await startTest(userId)

    // 3. Cargar preguntas
    const { area, blocks } = await getQuestions(sessionId)

    // 4. Guardar en store y navegar
    test.setSession(sessionId, area, blocks)
    router.push({ name: 'test' })

  } catch (err) {
    error.value = err.message || 'No se pudo iniciar sesión. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>