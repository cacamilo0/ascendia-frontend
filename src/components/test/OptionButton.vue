<template>
  <button
      @click="!disabled && $emit('select')"
      class="w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors"
      :class="[
      disabled ? 'cursor-default' : 'cursor-pointer',
      stateClass
    ]"
  >
    <span class="font-medium mr-2">{{ label }}.</span>{{ text }}
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: String,
  label: String,
  selected: Boolean,
  disabled: Boolean,
  correct: { type: Boolean, default: null },   // null = sin feedback
  incorrect: { type: Boolean, default: null },  // null = sin feedback
})

defineEmits(['select'])

const stateClass = computed(() => {
  if (props.correct) return 'bg-green-900 border-green-600 text-green-200'
  if (props.incorrect) return 'bg-red-900 border-red-600 text-red-200'
  if (props.selected) return 'bg-blue-600 border-blue-500 text-white'
  return 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
})
</script>