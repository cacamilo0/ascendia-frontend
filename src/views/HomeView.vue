<template>
  <div class="min-h-screen bg-gray-950 text-white">

    <header class="border-b border-gray-800 px-4 py-3">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <span class="text-sm font-semibold text-white">Ascendia</span>
        <button
            @click="handleLogout"
            class="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-4 py-8 space-y-4">

      <div class="mb-6">
        <h1 class="text-xl font-semibold text-white">¿Qué quieres hacer hoy?</h1>
        <p class="text-sm text-gray-400 mt-1">{{ auth.email }}</p>
      </div>

      <!-- Card ASSESSMENT -->
      <div
          @click="openModal('ASSESSMENT')"
          class="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 cursor-pointer transition-colors"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg shrink-0">
            🎯
          </div>
          <span class="text-xs font-semibold text-blue-400 uppercase tracking-widest">Prueba</span>
        </div>
        <h2 class="text-base font-semibold text-white mb-2">Iniciar sesión de prueba</h2>
        <ul class="space-y-1.5">
          <li class="flex items-center gap-2 text-sm text-gray-400">
            <span class="text-yellow-500">⚡</span> Afecta tu progreso
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-400">
            <span class="text-gray-500">🔇</span> Sin ayuda inmediata
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-400">
            <span class="text-blue-400">📊</span> Review completo al finalizar
          </li>
        </ul>
      </div>

      <!-- Card PRACTICE -->
      <div
          @click="openModal('PRACTICE')"
          class="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 cursor-pointer transition-colors"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-lg shrink-0">
            📚
          </div>
          <span class="text-xs font-semibold text-green-400 uppercase tracking-widest">Práctica</span>
        </div>
        <h2 class="text-base font-semibold text-white mb-2">Iniciar sesión con ayuda</h2>
        <ul class="space-y-1.5">
          <li class="flex items-center gap-2 text-sm text-gray-400">
            <span class="text-green-400">✓</span> Feedback inmediato por pregunta
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-400">
            <span class="text-green-400">✓</span> Explicación de cada respuesta
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-400">
            <span class="text-green-400">✓</span> Tips disponibles
          </li>
          <li class="flex items-center gap-2 text-sm text-gray-400">
            <span class="text-gray-500">○</span> No afecta tu progreso
          </li>
        </ul>
      </div>

      <!-- Card sesiones anteriores -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <button
            @click="showHistory = !showHistory"
            class="w-full flex items-start justify-between p-6 cursor-pointer hover:bg-gray-800 transition-colors text-left"
        >
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg shrink-0">
              🕓
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Ver sesiones anteriores</h2>
              <p class="text-sm text-gray-400 mt-0.5">
                <span v-if="loadingSessions">Cargando...</span>
                <span v-else-if="sessions.length === 0">Sin sesiones registradas</span>
                <span v-else>{{ sessions.length }} {{ sessions.length === 1 ? 'sesión' : 'sesiones' }} completadas</span>
              </p>
            </div>
          </div>
          <span class="text-gray-500 text-xs mt-1 shrink-0">
            {{ showHistory ? '▲' : '▼' }}
          </span>
        </button>

        <!-- Lista de sesiones -->
        <div v-if="showHistory && sessions.length > 0" class="border-t border-gray-800 divide-y divide-gray-800">
          <div
              v-for="session in sessions"
              :key="session.sessionId"
              class="px-6 py-4 flex items-center justify-between gap-4"
          >
            <div class="flex-1 min-w-0">
              <!-- Modo + área -->
              <div class="flex items-center gap-2 mb-1">
                <span
                    class="text-xs font-semibold px-2 py-0.5 rounded-md"
                    :class="session.mode === 'ASSESSMENT'
                    ? 'bg-blue-900 text-blue-300'
                    : 'bg-green-900 text-green-300'"
                >
                  {{ session.mode === 'ASSESSMENT' ? 'Prueba' : 'Práctica' }}
                </span>
                <span class="text-xs text-gray-500">{{ session.area }}</span>
              </div>

              <!-- Score -->
              <p class="text-base font-bold" :class="scoreColor(session.score)">
                {{ session.score }}%
                <span class="text-xs font-normal text-gray-500 ml-1">
                  {{ session.correct }}/{{ session.total }}
                </span>
              </p>

              <!-- Fecha, hora y duración -->
              <p class="text-xs text-gray-600 mt-0.5">
                {{ formatDate(session.startedAt) }} · {{ formatTime(session.startedAt) }} · {{ formatDuration(session.durationSeconds) }}
              </p>
            </div>

            <!-- Botón ver revisión -->
            <button
                v-if="session.mode === 'ASSESSMENT'"
                @click="handleViewReview(session)"
                class="shrink-0 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 text-xs font-medium hover:border-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              Ver revisión
            </button>
          </div>
        </div>

        <!-- Sin sesiones -->
        <div v-if="showHistory && sessions.length === 0 && !loadingSessions" class="border-t border-gray-800 px-6 py-8 text-center">
          <p class="text-sm text-gray-600">Aún no has completado ninguna sesión.</p>
        </div>

      </div>

    </main>

    <!-- Modal de confirmación -->
    <div
        v-if="modalMode"
        class="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50"
        @click.self="modalMode = null"
    >
      <div class="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
        <h3 class="text-white font-semibold text-base mb-1">
          {{ modalMode === 'ASSESSMENT' ? 'Iniciar sesión de prueba' : 'Iniciar sesión con ayuda' }}
        </h3>
        <p class="text-gray-400 text-sm mb-6 leading-relaxed">
          {{ modalMode === 'ASSESSMENT'
            ? 'Esta sesión afecta tu progreso. No tendrás ayuda durante el test. Verás el review completo al finalizar.'
            : 'Esta sesión no afecta tu progreso. Tendrás feedback inmediato, explicaciones y tips en cada pregunta.'
          }}
        </p>

        <div v-if="error" class="mb-4 px-3 py-2 bg-red-950 border border-red-800 rounded-lg">
          <p class="text-red-400 text-xs">{{ error }}</p>
        </div>

        <div class="flex gap-3">
          <button
              @click="modalMode = null"
              :disabled="loading"
              class="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
              @click="handleStart"
              :disabled="loading"
              class="flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              :class="modalMode === 'ASSESSMENT' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-700 hover:bg-green-600'"
          >
            <span v-if="loading">Iniciando...</span>
            <span v-else>Comenzar</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useTestStore } from '../stores/test.js'
import { startSession, getQuestions, getHistory } from '../api/test.js'

const router = useRouter()
const auth = useAuthStore()
const test = useTestStore()

const modalMode = ref(null)
const loading = ref(false)
const error = ref(null)

const sessions = ref([])
const loadingSessions = ref(false)
const showHistory = ref(false)

onMounted(async () => {
  loadingSessions.value = true
  try {
    const data = await getHistory(auth.userId)
    sessions.value = data.sessions
  } catch {
    // silencioso — el historial es secundario
  } finally {
    loadingSessions.value = false
  }
})

function openModal(mode) {
  error.value = null
  modalMode.value = mode
}

async function handleStart() {
  loading.value = true
  error.value = null
  try {
    const { sessionId } = await startSession(auth.userId, modalMode.value)
    const { area, blocks } = await getQuestions(sessionId)
    test.setSession(sessionId, modalMode.value, area, blocks)
    router.push({ name: 'test' })
  } catch (err) {
    error.value = err.message || 'No se pudo iniciar la sesión. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

async function handleViewReview(session) {
  try {
    const { getReview } = await import('../api/test.js')
    const review = await getReview(session.sessionId)
    test.mode = session.mode
    test.setReview(review)
    router.push({ name: 'review' })
  } catch {
    // manejar error
  }
}

function handleLogout() {
  test.reset()
  auth.logout()
  router.push({ name: 'login' })
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function scoreColor(score) {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  return 'text-red-400'
}
</script>