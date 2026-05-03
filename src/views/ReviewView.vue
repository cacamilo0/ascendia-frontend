<template>
  <div class="min-h-screen bg-gray-950 text-white">

    <!-- Header -->
    <header class="border-b border-gray-800 px-4 py-3">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <span class="text-sm font-semibold">Ascendia</span>
        <span
            class="text-xs font-semibold px-2 py-1 rounded-md"
            :class="test.mode === 'ASSESSMENT' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'"
        >
          {{ test.mode === 'ASSESSMENT' ? 'Prueba' : 'Práctica' }}
        </span>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-4 py-8 space-y-6">

      <!-- Puntaje global -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
          Resultado final
        </p>
        <div class="text-7xl font-bold mb-2" :class="scoreColor">
          {{ review.score }}%
        </div>
        <p class="text-gray-400 text-sm mb-6">puntaje global</p>

        <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
              class="h-full rounded-full transition-all duration-700"
              :class="scoreBarColor"
              :style="{ width: review.score + '%' }"
          />
        </div>

        <!-- Resumen numérico -->
        <div class="grid grid-cols-3 gap-4 mt-6">
          <div>
            <p class="text-2xl font-bold text-green-400">{{ review.correct }}</p>
            <p class="text-xs text-gray-500 mt-1">Correctas</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-red-400">{{ review.incorrect }}</p>
            <p class="text-xs text-gray-500 mt-1">Incorrectas</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-400">{{ review.omitted }}</p>
            <p class="text-xs text-gray-500 mt-1">Omitidas</p>
          </div>
        </div>

        <!-- Duración -->
        <p v-if="test.finishData?.durationSeconds" class="text-xs text-gray-600 mt-4">
          Completado en {{ formatDuration(test.finishData.durationSeconds) }}
        </p>
      </div>

      <!-- Stats por categoría -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
          Por categoría
        </p>
        <div class="space-y-4">
          <div
              v-for="(data, category) in review.stats.byCategory"
              :key="category"
          >
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-sm text-gray-300">{{ categoryLabel(category) }}</span>
              <span class="text-sm font-semibold" :class="statColor(data.percentage)">
                {{ data.correct }}/{{ data.total }}
              </span>
            </div>
            <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="barColor(data.percentage)"
                  :style="{ width: data.percentage + '%' }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Stats por dificultad -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
          Por dificultad
        </p>
        <div class="space-y-4">
          <div
              v-for="(data, difficulty) in review.stats.byDifficulty"
              :key="difficulty"
          >
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-sm text-gray-300">{{ difficultyLabel(difficulty) }}</span>
              <span class="text-sm font-semibold" :class="statColor(data.percentage)">
                {{ data.correct }}/{{ data.total }}
              </span>
            </div>
            <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="barColor(data.percentage)"
                  :style="{ width: data.percentage + '%' }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Detalle por pregunta — solo ASSESSMENT -->
      <div v-if="test.mode === 'ASSESSMENT'" class="space-y-3">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">
          Detalle por pregunta
        </p>

        <div
            v-for="(item, i) in review.questions"
            :key="item.questionId"
            class="bg-gray-900 border rounded-2xl p-5"
            :class="item.omitted
            ? 'border-gray-700'
            : item.correct
              ? 'border-gray-700'
              : 'border-red-900'"
        >
          <!-- Encabezado -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <span class="text-xs text-gray-500 shrink-0">Pregunta {{ i + 1 }}</span>
            <span
                class="text-xs font-semibold px-2 py-0.5 rounded-md shrink-0"
                :class="item.omitted
                ? 'bg-gray-800 text-gray-400'
                : item.correct
                  ? 'bg-green-900 text-green-300'
                  : 'bg-red-900 text-red-300'"
            >
              {{ item.omitted ? 'Omitida' : item.correct ? 'Correcta' : 'Incorrecta' }}
            </span>
          </div>

          <!-- Texto de la pregunta -->
          <p class="text-sm text-gray-200 leading-relaxed mb-4">
            {{ questionText(item.questionId) }}
          </p>

          <!-- Opciones relevantes -->
          <div class="space-y-2">
            <!-- Respuesta seleccionada (si no fue omitida y fue incorrecta) -->
            <div
                v-if="!item.omitted && !item.correct"
                class="flex items-center gap-2 px-3 py-2 bg-red-950 border border-red-800 rounded-lg"
            >
              <span class="text-red-400 text-xs font-semibold shrink-0">Tu respuesta</span>
              <span class="text-red-300 text-sm">{{ optionText(item.questionId, item.selectedOptionId) }}</span>
            </div>

            <!-- Respuesta correcta -->
            <div class="flex items-center gap-2 px-3 py-2 bg-green-950 border border-green-800 rounded-lg">
              <span class="text-green-400 text-xs font-semibold shrink-0">Correcta</span>
              <span class="text-green-300 text-sm">{{ optionText(item.questionId, item.correctOptionId) }}</span>
            </div>
          </div>

          <!-- Explicación -->
          <div class="mt-3 pt-3 border-t border-gray-800">
            <p class="text-xs text-gray-500 mb-1">Explicación</p>
            <p class="text-sm text-gray-400 leading-relaxed">{{ item.explanation }}</p>
          </div>

        </div>
      </div>

      <!-- Botón volver -->
      <button
          @click="handleHome"
          class="w-full py-3 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-500 hover:text-white transition-colors cursor-pointer"
      >
        Volver al inicio
      </button>

    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useTestStore } from '../stores/test.js'

const router = useRouter()
const auth = useAuthStore()
const test = useTestStore()

const review = computed(() => test.review)

// Mapas para lookup rápido
const questionMap = computed(() => {
  const map = {}
  for (const q of test.questions) {
    map[q.id] = q
  }
  return map
})

function questionText(questionId) {
  return questionMap.value[questionId]?.text ?? ''
}

function optionText(questionId, optionId) {
  const question = questionMap.value[questionId]
  if (!question) return ''
  return question.options.find(o => o.id === optionId)?.text ?? ''
}

const scoreColor = computed(() => {
  const s = review.value.score
  if (s >= 80) return 'text-green-400'
  if (s >= 60) return 'text-yellow-400'
  return 'text-red-400'
})

const scoreBarColor = computed(() => {
  const s = review.value.score
  if (s >= 80) return 'bg-green-500'
  if (s >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
})

function statColor(percentage) {
  if (percentage >= 80) return 'text-green-400'
  if (percentage >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

function barColor(percentage) {
  if (percentage >= 80) return 'bg-green-500'
  if (percentage >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

function categoryLabel(key) {
  const map = { LITERAL: 'Comprensión literal', INFERENCE: 'Inferencia', VOCABULARY: 'Vocabulario' }
  return map[key] ?? key
}

function difficultyLabel(key) {
  const map = { EASY: 'Fácil', MEDIUM: 'Medio', HARD: 'Difícil' }
  return map[key] ?? key
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function handleHome() {
  test.reset()
  router.push({ name: 'home' })
}
</script>