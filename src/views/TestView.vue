<template>
  <div class="min-h-screen bg-gray-950 text-white">

    <!-- Header fijo -->
    <header class="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 px-4 py-3">
      <div class="max-w-2xl mx-auto flex items-center justify-between gap-4">
        <span class="text-sm font-semibold text-white shrink-0">Ascendia</span>

        <!-- Barra de progreso -->
        <div class="flex-1">
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progreso</span>
            <span>{{ test.answeredCount }} / {{ test.totalQuestions }}</span>
          </div>
          <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
                class="h-full bg-blue-500 rounded-full transition-all duration-300"
                :style="{ width: progressPercent + '%' }"
            />
          </div>
        </div>

        <span class="text-xs text-gray-400 shrink-0">
          Bloque {{ currentBlockIndex + 1 }}/{{ test.blocks.length }}
        </span>
      </div>
    </header>

    <!-- Contenido -->
    <main v-if="currentBlock" class="max-w-2xl mx-auto px-4 py-6 pb-32">
      <component
          :is="currentBlock.type === 'PASSAGE' ? PassageBlock : StandaloneBlock"
          :block="currentBlock"
          :answers="test.answers"
          :questionOffset="questionOffset"
          @answer="handleAnswer"
      />
    </main>

    <!-- Footer fijo con navegación -->
    <footer class="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 px-4 py-3">
      <div class="max-w-2xl mx-auto flex gap-3">
        <button
            v-if="currentBlockIndex > 0"
            @click="currentBlockIndex--"
            class="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          ← Anterior
        </button>

        <button
            v-if="!isLastBlock"
            @click="currentBlockIndex++"
            class="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors cursor-pointer"
        >
          Siguiente →
        </button>

        <button
            v-else
            @click="confirmSubmit"
            :disabled="!test.isComplete || submitting"
            class="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
            :class="test.isComplete
            ? 'bg-green-600 hover:bg-green-500 text-white'
            : 'bg-gray-800 text-gray-500'"
        >
          <span v-if="submitting">Enviando...</span>
          <span v-else-if="test.isComplete">Enviar examen</span>
          <span v-else>Responde todas las preguntas</span>
        </button>
      </div>
    </footer>

    <!-- Modal de confirmación -->
    <div
        v-if="showConfirmModal"
        class="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50"
        @click.self="showConfirmModal = false"
    >
      <div class="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
        <h3 class="text-white font-semibold text-base mb-2">¿Enviar el examen?</h3>
        <p class="text-gray-400 text-sm mb-6 leading-relaxed">
          Una vez enviado no podrás modificar tus respuestas. Asegúrate de haber respondido todo.
        </p>
        <div class="flex gap-3">
          <button
              @click="showConfirmModal = false"
              class="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-500 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
              @click="handleSubmit"
              class="flex-1 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Sí, enviar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '../stores/test.js'
import { submitTest } from '../api/test.js'
import PassageBlock from '../components/test/PassageBlock.vue'
import StandaloneBlock from '../components/test/StandaloneBlock.vue'

const router = useRouter()
const test = useTestStore()

const currentBlockIndex = ref(0)
const submitting = ref(false)
const showConfirmModal = ref(false)

const currentBlock = computed(() => test.blocks[currentBlockIndex.value] ?? null)
const isLastBlock = computed(() => currentBlockIndex.value === test.blocks.length - 1)

const progressPercent = computed(() =>
    test.totalQuestions > 0
        ? (test.answeredCount / test.totalQuestions) * 100
        : 0
)

// Calcula cuántas preguntas vienen antes del bloque actual
// para numerar correctamente cada pregunta
const questionOffset = computed(() => {
  let offset = 0
  for (let i = 0; i < currentBlockIndex.value; i++) {
    offset += test.blocks[i].questions.length
  }
  return offset
})

function handleAnswer(questionId, selectedOptionId) {
  test.answerQuestion(questionId, selectedOptionId)
}

function confirmSubmit() {
  if (!test.isComplete || submitting.value) return
  showConfirmModal.value = true
}

async function handleSubmit() {
  showConfirmModal.value = false
  submitting.value = true

  try {
    const results = await submitTest(test.sessionId, test.answersPayload)
    test.setResults(results)
    router.push({ name: 'results' })
  } catch (err) {
    alert('Hubo un error al enviar el examen. Intenta de nuevo.')
  } finally {
    submitting.value = false
  }
}
</script>