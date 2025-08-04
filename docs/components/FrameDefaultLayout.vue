<script setup>
import { ref, onMounted } from 'vue'
import { createApp } from 'whyframe:app'
import { TableComponent } from '@s3_dse/v-tabler'
import '@s3_dse/v-tabler/v-tabler.css'
// import 'virtual:uno.css' // Temporarily disabled due to VitePress issues
const el = ref()

onMounted(() => {
  console.log('FrameDefaultLayout mounted')
  
  // Create the whyframe app and provide the components it needs
  createApp(el.value, {
    TableComponent
  })
})
</script>

<template>
  <div ref="el" class="whyframe-frame-default-layout">
    <!-- Content will be mounted here by whyframe -->
  </div>
</template>