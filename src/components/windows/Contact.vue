<script setup lang="ts">
import { useI18n } from '../../i18n'

const { messages } = useI18n()
</script>

<template>
  <section class="contact-window">
    <h2>{{ messages.contact }}</h2>
    <p>{{ messages.content.contact }}</p>
  </section>
</template>

<style scoped>
.contact-window {
  min-height: 180px;
  padding: 16px;
  color: #000;
  background: #ffffe1;
  border: 1px solid #808080;
  font-family: 'Courier New', monospace;
}

.contact-window h2 {
  margin: 0 0 12px;
  color: #000080;
  font-size: 18px;
}

.contact-window p {
  margin: 0;
  line-height: 1.6;
}
</style>
