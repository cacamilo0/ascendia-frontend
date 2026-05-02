<template>
  <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-8">
    <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Preguntas</p>
    <QuestionItem
        v-for="(question, i) in block.questions"
        :key="question.id"
        :question="question"
        :index="questionOffset + i + 1"
        :selectedOptionId="answers[question.id] ?? null"
        @answer="(qId, oId) => $emit('answer', qId, oId)"
    />
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