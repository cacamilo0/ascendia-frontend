<template>
  <div class="space-y-6">
    <!-- Passage -->
    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <p class="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Lectura</p>
      <h2 class="text-white font-semibold text-base mb-4">{{ block.passage.title }}</h2>
      <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{{ block.passage.text }}</p>
    </div>

    <!-- Preguntas -->
    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-8">
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Preguntas del pasaje</p>
      <QuestionItem
          v-for="(question, i) in block.questions"
          :key="question.id"
          :question="question"
          :index="questionOffset + i + 1"
          :selectedOptionId="answers[question.id] ?? null"
          @answer="(qId, oId) => $emit('answer', qId, oId)"
      />
    </div>
  </div>
</template>

<script setup>
import QuestionItem from './QuestionItem.vue'

defineProps({
  block: Object,
  answers: Object,
  questionOffset: Number,
})

defineEmits(['answer'])
</script>