<script setup lang="ts">
import { useI18n } from '../../i18n'

const { messages } = useI18n()
</script>

<template>
  <section class="projects-window">
    <div class="projects-window__toolbar" aria-hidden="true">{{messages.file}}&nbsp;&nbsp;{{messages.file}}&nbsp;&nbsp;{{messages.view }}</div>
    <h2>{{ messages.projects }}</h2>
    <p>{{ messages.content.projects }}</p>
  </section>
</template>

<style scoped>
.projects-window {
  min-height: 180px;
  padding: 8px;
  color: #000;
  background: #c0c0c0;
  font-family: Arial, sans-serif;
}

.projects-window__toolbar {
  margin-bottom: 16px;
  padding: 4px 6px;
  background: #fff;
  border: 1px solid #808080;
  font-size: 12px;
}

.projects-window h2 {
  margin: 0 0 10px;
  font-size: 18px;
}

.projects-window p {
  margin: 0;
  line-height: 1.4;
}
</style>
