<template>
  <button
      @click="$emit('select')"
      class="w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors cursor-pointer"
      :class="selected
      ? 'bg-blue-600 border-blue-500 text-white'
      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'"
  >
    <span class="font-medium mr-2">{{ label }}.</span>{{ text }}
  </button>
</template>

<script setup>
defineProps({
  text: String,
  label: String,
  selected: Boolean,
})

defineEmits(['select'])
</script>