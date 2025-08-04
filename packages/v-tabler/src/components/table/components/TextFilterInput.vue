<template>
  <div>
    <DropdownMenuLabel class="block text-xs font-medium text-muted mb-1" :for="inputId">
      Contains text:
    </DropdownMenuLabel>
    <input
      :id="inputId"
      :value="value"
      type="text"
      class="form-inputfield w-full text-default"
      :placeholder="placeholder"
      @input="onInput"
      @keydown.stop
    />
  </div>
</template>
<script setup>
import {
    DropdownMenuLabel,
} from 'reka-ui'
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: String,
  inputId: String,
  placeholder: String
})
const emit = defineEmits(['update:modelValue'])
const value = ref(props.modelValue || '')
watch(() => props.modelValue, v => { value.value = v })
function onInput(e) {
  value.value = e.target.value
  emit('update:modelValue', value.value)
}
</script>
