<script setup lang="ts">
import { useI18n } from '../../i18n'

const { messages } = useI18n()
</script>

<template>
  <section class="about-window">
    <h2>{{ messages.about }}</h2>
    <p>{{ messages.content.about }}</p>
  </section>
</template>

<style scoped>
.about-window {
  min-height: 180px;
  padding: 12px;
  color: #000;
  background: #fff;
  font-family: 'Times New Roman', serif;
}

.about-window h2 {
  margin: 0 0 16px;
  font-size: 24px;
}

.about-window p {
  max-width: 55ch;
  margin: 0;
  line-height: 1.5;
}
</style>
