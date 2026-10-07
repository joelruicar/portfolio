<script setup lang="ts">
import { ref } from 'vue'
import Loading from './components/Loading.vue'
import Desktop from './components/desktop/Desktop.vue'

const loadingFinished = ref(false)
</script>

<template>
  <Desktop />
  <!-- <Loading v-if="!loadingFinished" @finished="loadingFinished = true" /> -->
</template>