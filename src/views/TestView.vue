<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">

    <!-- Header -->
    <header class="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 px-4 py-3 shrink-0">
      <div class="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <span class="text-sm font-semibold shrink-0">Ascendia</span>

        <div class="flex-1">
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>Pregunta {{ test.currentIndex + 1 }} de {{ test.totalQuestions }}</span>
            <span>{{ test.answeredCount }}/{{ test.totalQuestions }} respondidas</span>
          </div>
          <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
                class="h-full bg-blue-500 rounded-full transition-all duration-300"
                :style="{ width: test.progressPercent + '%' }"
            />
          </div>
        </div>

        <span
            class="text-xs font-semibold px-2 py-1 rounded-md shrink-0"
            :class="test.mode === 'ASSESSMENT' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'"
        >
          {{ test.mode === 'ASSESSMENT' ? 'Prueba' : 'Práctica' }}
        </span>
      </div>
    </header>

    <!-- Contenido principal -->
    <div v-if="currentQuestion" class="flex-1 flex flex-col lg:flex-row max-w-3xl mx-auto w-full">

      <!-- Panel passage — desktop izquierda / móvil arriba colapsable -->
      <div
          v-if="currentQuestion.passage"
          class="lg:w-1/2 lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] lg:overflow-y-auto shrink-0 border-b border-gray-800 lg:border-b-0 lg:border-r"
      >
        <!-- Móvil: colapsable -->
        <div class="lg:hidden">
          <button
              @click="passageExpanded = !passageExpanded"
              class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>{{ currentQuestion.passage.title }}</span>
            <span class="text-gray-500 text-xs ml-2">{{ passageExpanded ? '▲ Ocultar' : '▼ Leer pasaje' }}</span>
          </button>
          <div v-if="passageExpanded" class="px-4 pb-4">
            <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {{ currentQuestion.passage.text }}
            </p>
          </div>
        </div>

        <!-- Desktop: siempre visible -->
        <div class="hidden lg:block p-6">
          <p class="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Lectura</p>
          <h2 class="text-white font-semibold text-base mb-4">{{ currentQuestion.passage.title }}</h2>
          <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {{ currentQuestion.passage.text }}
          </p>
        </div>
      </div>

      <!-- Panel pregunta -->
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex-1 px-4 py-6 lg:px-6 space-y-6 pb-36">

          <!-- Tip visible (antes de responder) -->
          <div
              v-if="test.mode === 'PRACTICE' && currentTip && !currentFeedback"
              class="flex gap-3 px-4 py-3 bg-yellow-950 border border-yellow-800 rounded-xl"
          >
            <span class="text-yellow-400 shrink-0">💡</span>
            <p class="text-yellow-200 text-sm leading-relaxed">{{ currentTip }}</p>
          </div>

          <!-- Pregunta -->
          <QuestionItem
              :question="currentQuestion"
              :index="test.currentIndex + 1"
              :selectedOptionId="test.answers[currentQuestion.id] ?? null"
              :mode="test.mode"
              :feedback="currentFeedback ?? null"
              @answer="handleAnswer"
          />

          <!-- Feedback PRACTICE -->
          <div v-if="test.mode === 'PRACTICE' && currentFeedback" class="space-y-3">

            <!-- Resultado -->
            <div
                class="flex items-center gap-2 px-4 py-3 rounded-xl border"
                :class="currentFeedback.correct
                ? 'bg-green-950 border-green-800'
                : 'bg-red-950 border-red-800'"
            >
              <span>{{ currentFeedback.correct ? '✓' : '✗' }}</span>
              <p
                  class="text-sm font-medium"
                  :class="currentFeedback.correct ? 'text-green-300' : 'text-red-300'"
              >
                {{ currentFeedback.correct ? '¡Correcto!' : 'Incorrecto' }}
              </p>
            </div>

            <!-- Explicación -->
            <div class="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Explicación</p>
              <p class="text-gray-300 text-sm leading-relaxed">{{ currentFeedback.explanation }}</p>
            </div>

            <!-- Tip post-respuesta -->
            <div
                v-if="currentFeedback.tip"
                class="flex gap-3 px-4 py-3 bg-yellow-950 border border-yellow-800 rounded-xl"
            >
              <span class="text-yellow-400 shrink-0">💡</span>
              <p class="text-yellow-200 text-sm leading-relaxed">{{ currentFeedback.tip }}</p>
            </div>

          </div>

        </div>
      </div>
    </div>

    <!-- Footer fijo -->
    <footer class="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-4 py-3 z-10">
      <div class="max-w-3xl mx-auto flex gap-3 items-center">

        <!-- Botón Ver tip (PRACTICE, antes de responder) -->
        <button
            v-if="test.mode === 'PRACTICE' && !currentAnswered && !currentTip"
            @click="handleGetTip"
            :disabled="loadingTip"
            class="px-4 py-2.5 rounded-lg border border-yellow-700 text-yellow-400 text-sm font-medium hover:bg-yellow-950 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
        >
          {{ loadingTip ? '...' : '💡 Ver tip' }}
        </button>

        <div class="flex gap-3 flex-1">
          <button
              v-if="!test.isFirst"
              @click="handlePrev"
              class="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            ← Anterior
          </button>

          <button
              v-if="!test.isLast"
              @click="handleNext"
              class="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Siguiente →
          </button>

          <button
              v-else
              @click="openFinishModal"
              class="flex-1 py-2.5 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Finalizar
          </button>
        </div>

      </div>
    </footer>

    <!-- Modal finalizar -->
    <div
        v-if="showFinishModal"
        class="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50"
        @click.self="showFinishModal = false"
    >
      <div class="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
        <h3 class="text-white font-semibold text-base mb-2">¿Finalizar el test?</h3>

        <p v-if="test.omittedCount > 0" class="text-yellow-400 text-sm mb-3 leading-relaxed">
          Tienes {{ test.omittedCount }} {{ test.omittedCount === 1 ? 'pregunta sin responder' : 'preguntas sin responder' }}.
          Las preguntas omitidas no suman puntaje.
        </p>
        <p v-else class="text-gray-400 text-sm mb-3 leading-relaxed">
          Has respondido todas las preguntas.
        </p>

        <p class="text-gray-500 text-xs mb-6">Esta acción no se puede deshacer.</p>

        <div v-if="finishError" class="mb-4 px-3 py-2 bg-red-950 border border-red-800 rounded-lg">
          <p class="text-red-400 text-xs">{{ finishError }}</p>
        </div>

        <div class="flex gap-3">
          <button
              @click="showFinishModal = false"
              :disabled="finishing"
              class="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
              @click="handleFinish"
              :disabled="finishing"
              class="flex-1 py-2.5 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <span v-if="finishing">Finalizando...</span>
            <span v-else>Sí, finalizar</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '../stores/test.js'
import { postAnswer, getTip, finishSession, getReview } from '../api/test.js'
import QuestionItem from '../components/test/QuestionItem.vue'

const router = useRouter()
const test = useTestStore()

const passageExpanded = ref(false)
const loadingTip = ref(false)
const showFinishModal = ref(false)
const finishing = ref(false)
const finishError = ref(null)

const currentQuestion = computed(() => test.currentQuestion)
const currentAnswered = computed(() => currentQuestion.value
    ? test.answers[currentQuestion.value.id] != null
    : false
)
const currentFeedback = computed(() => currentQuestion.value
    ? test.feedback[currentQuestion.value.id] ?? null
    : null
)
const currentTip = computed(() => currentQuestion.value
    ? test.tips[currentQuestion.value.id] ?? null
    : null
)

// Colapsar passage al cambiar de pregunta en móvil
watch(() => test.currentIndex, () => {
  passageExpanded.value = false
})

async function handleAnswer(questionId, selectedOptionId) {
  if (test.mode === 'PRACTICE' && test.answers[questionId] != null) return

  test.setAnswer(questionId, selectedOptionId)

  try {
    const response = await postAnswer(test.sessionId, questionId, selectedOptionId)
    if (test.mode === 'PRACTICE') {
      test.setFeedback(questionId, response)
    }
  } catch {
    // La respuesta ya quedó en el store local
    // En ASSESSMENT el backend la guardará cuando recupere conexión
  }
}

async function handleGetTip() {
  if (!currentQuestion.value || loadingTip.value) return
  loadingTip.value = true
  try {
    const { tip } = await getTip(test.sessionId, currentQuestion.value.id)
    test.setTip(currentQuestion.value.id, tip)
  } catch {
    // silencioso — el tip es opcional
  } finally {
    loadingTip.value = false
  }
}

function handlePrev() {
  test.goPrev()
}

function handleNext() {
  test.goNext()
}

function openFinishModal() {
  finishError.value = null
  showFinishModal.value = true
}

async function handleFinish() {
  finishing.value = true
  finishError.value = null

  try {
    const finishData = await finishSession(test.sessionId)
    test.setFinishData(finishData)

    if (test.mode === 'PRACTICE') {
      const review = await getReview(test.sessionId)
      test.setReview(review)
      router.push({ name: 'review' })
    } else {
      const review = await getReview(test.sessionId)
      test.setReview(review)
      router.push({ name: 'review' })
    }
  } catch (err) {
    finishError.value = err.message || 'No se pudo finalizar el test. Intenta de nuevo.'
  } finally {
    finishing.value = false
  }
}
</script>