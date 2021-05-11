<template>
  <button @click="type = 1">
    component
  </button>
  <button @click="type = 2">
    preview
  </button>
  <button @click="type = 3">
    directive
  </button>
  <v-component v-if="type === 1"></v-component>
  <v-preview v-if="type === 2"></v-preview>
  <v-directive v-if="type === 3"></v-directive>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import vComponent from './component/component.vue'
import vPreview from './component/preview.vue'
import vDirective from './component/directive.vue'
const type = ref(1)
</script>
