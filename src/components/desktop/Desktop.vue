<script setup lang="ts">
import { ref, computed } from 'vue'

import Taskbar from '../Taskbar.vue'

const desktop = ref<HTMLElement | null>(null)

const selecting = ref(false)
const start = ref({ x: 0, y: 0 })
const current = ref({ x: 0, y: 0 })

// Normaliza el rectángulo para que funcione arrastrando en cualquier dirección
const selectionStyle = computed(() => {
  const x = Math.min(start.value.x, current.value.x)
  const y = Math.min(start.value.y, current.value.y)
  return {
    left: x + 'px',
    top: y + 'px',
    width: Math.abs(current.value.x - start.value.x) + 'px',
    height: Math.abs(current.value.y - start.value.y) + 'px',
  }
})

function pointFromEvent(e: PointerEvent) {
  const rect = desktop.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onPointerDown(e: PointerEvent) {
  // solo si se pulsa el fondo, no un icono ni una ventana
  if (e.target !== desktop.value) return
  selecting.value = true
  start.value = current.value = pointFromEvent(e)
  desktop.value!.setPointerCapture(e.pointerId) // sigue funcionando si el ratón sale del área
}

function onPointerMove(e: PointerEvent) {
  if (!selecting.value) return
  current.value = pointFromEvent(e)
}

function onPointerUp() {
  selecting.value = false
}
</script>

<template>
  <section
    ref="desktop"
    class="desktop"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div v-if="selecting" class="selection" :style="selectionStyle" />
  </section>
  <Taskbar />
</template>

<style scoped>
.desktop {
  width: 100%;
  position: relative;
  min-height: 100vh;
  user-select: none; 
  min-width: 100dvw;
  height: 100dvh;
  min-height: 100dvh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  background: #008080;
}
.selection {
  position: absolute;
  border: 1px dotted #fff;
  background: rgba(0, 0, 128, 0.15); /* opcional: Windows 95 no lo rellenaba */
  pointer-events: none; /* no interfiere con los eventos */
}
</style>

