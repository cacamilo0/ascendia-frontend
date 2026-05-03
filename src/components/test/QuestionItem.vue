<template>
  <div class="space-y-3">
    <p class="text-gray-200 text-sm leading-relaxed">
      <span class="font-semibold text-gray-400 mr-2">{{ index }}.</span>{{ question.text }}
    </p>
    <div class="space-y-2">
      <OptionButton
          v-for="(option, i) in question.options"
          :key="option.id"
          :text="option.text"
          :label="labels[i]"
          :selected="selectedOptionId === option.id"
          :disabled="!!selectedOptionId && mode === 'PRACTICE'"
          :correct="feedback && option.id === feedback.correctOptionId"
          :incorrect="feedback && selectedOptionId === option.id && !feedback.correct"
          @select="$emit('answer', question.id, option.id)"
      />
    </div>
  </div>
</template>

<script setup>
import OptionButton from './OptionButton.vue'

defineProps({
  question: Object,
  index: Number,
  selectedOptionId: { type: Number, default: null },
  mode: String,
  feedback: { type: Object, default: null },
})

defineEmits(['answer'])

const labels = ['A', 'B', 'C', 'D', 'E']
</script>