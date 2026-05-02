<template>
  <div class="min-h-screen bg-gray-950 text-white">

    <!-- Header -->
    <header class="border-b border-gray-800 px-4 py-3">
      <div class="max-w-2xl mx-auto">
        <span class="text-sm font-semibold text-white">Ascendia</span>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-4 py-8 space-y-6">

      <!-- Puntaje global -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
          Resultado final
        </p>
        <div
            class="text-7xl font-bold mb-2"
            :class="scoreColor"
        >
          {{ formattedScore }}
        </div>
        <p class="text-gray-400 text-sm">puntaje global</p>

        <div class="mt-6 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
              class="h-full rounded-full transition-all duration-700"
              :class="scoreBarColor"
              :style="{ width: results.score + '%' }"
          />
        </div>
      </div>

      <!-- Por categoría -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
          Por categoría
        </p>
        <div class="space-y-4">
          <div
              v-for="(data, category) in results.byCategory"
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

      <!-- Por dificultad -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
          Por dificultad
        </p>
        <div class="space-y-4">
          <div
              v-for="(data, difficulty) in results.byDifficulty"
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

      <!-- Debilidades -->
      <div
          v-if="results.weaknesses.length > 0"
          class="bg-gray-900 border border-gray-800 rounded-2xl p-6"
      >
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
          Áreas a mejorar
        </p>
        <div class="space-y-3">
          <div
              v-for="weakness in results.weaknesses"
              :key="weakness.category"
              class="flex gap-3 p-4 bg-red-950 border border-red-900 rounded-xl"
          >
            <span class="text-red-400 mt-0.5 shrink-0">⚠</span>
            <div>
              <p class="text-sm font-medium text-red-300 mb-0.5">
                {{ categoryLabel(weakness.category) }}
              </p>
              <p class="text-xs text-red-400 leading-relaxed">{{ weakness.message }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin debilidades -->
      <div
          v-else
          class="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center"
      >
        <p class="text-2xl mb-2">🎯</p>
        <p class="text-sm font-medium text-green-400">Excelente desempeño</p>
        <p class="text-xs text-gray-500 mt-1">No se detectaron debilidades significativas</p>
      </div>

      <!-- Botón reiniciar -->
      <button
          @click="handleRestart"
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

const results = computed(() => test.results)

const formattedScore = computed(() => {
  const score = results.value.score
  return Number.isInteger(score) ? score : score.toFixed(1)
})

const scoreColor = computed(() => {
  const s = results.value.score
  if (s >= 80) return 'text-green-400'
  if (s >= 60) return 'text-yellow-400'
  return 'text-red-400'
})

const scoreBarColor = computed(() => {
  const s = results.value.score
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
  const map = {
    LITERAL: 'Comprensión literal',
    VOCABULARY: 'Vocabulario',
    INFERENCE: 'Inferencia',
  }
  return map[key] ?? key
}

function difficultyLabel(key) {
  const map = {
    EASY: 'Fácil',
    MEDIUM: 'Medio',
    HARD: 'Difícil',
  }
  return map[key] ?? key
}

function handleRestart() {
  test.reset()
  auth.logout()
  router.push({ name: 'login' })
}
</script>