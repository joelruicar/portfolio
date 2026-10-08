<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  icon: string
  zIndex: number
  position: { x: number; y: number }
  compact?: boolean
}>()

const emit = defineEmits<{
  close: []
  minimize: []
  focus: []
  move: [position: { x: number; y: number }]
}>()

const titlebar = ref<HTMLElement | null>(null)
const dragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

function startDrag(event: PointerEvent) {
  if (event.button !== 0 || !titlebar.value) return
  if (event.target instanceof Element && event.target.closest('button')) return

  const frame = titlebar.value.closest('.window') as HTMLElement | null
  if (!frame) return

  emit('focus')
  dragging.value = true
  const frameRect = frame.getBoundingClientRect()
  dragOffset.value = {
    x: event.clientX - frameRect.left,
    y: event.clientY - frameRect.top,
  }
  titlebar.value.setPointerCapture(event.pointerId)
}

function drag(event: PointerEvent) {
  if (!dragging.value || !titlebar.value) return

  const frame = titlebar.value.closest('.window') as HTMLElement | null
  const desktop = frame?.parentElement
  if (!frame || !desktop) return

  const desktopRect = desktop.getBoundingClientRect()
  const maxX = Math.max(0, desktop.clientWidth - frame.offsetWidth)
  const maxY = Math.max(0, desktop.clientHeight - frame.offsetHeight)
  const x = event.clientX - desktopRect.left - dragOffset.value.x
  const y = event.clientY - desktopRect.top - dragOffset.value.y

  emit('move', {
    x: Math.min(maxX, Math.max(0, x)),
    y: Math.min(maxY, Math.max(0, y)),
  })
}

function endDrag(event: PointerEvent) {
  if (!dragging.value || !titlebar.value) return

  dragging.value = false
  if (titlebar.value.hasPointerCapture(event.pointerId)) {
    titlebar.value.releasePointerCapture(event.pointerId)
  }
}
</script>

<template>
  <article
    class="window"
    :class="{ 'window--dragging': dragging, 'window--compact': compact }"
    :style="{ zIndex, left: `${position.x}px`, top: `${position.y}px` }"
    @pointerdown="emit('focus')"
  >
    <header
      ref="titlebar"
      class="window__titlebar"
      @pointerdown.stop="startDrag"
      @pointermove="drag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
    >
      <div class="window__title">
        <img v-if="icon.endsWith('.ico') || icon.endsWith('.png')" :src="icon" alt="" />
        <span v-else aria-hidden="true">{{ icon }}</span>
        <span>{{ title }}</span>
      </div>
      <div class="window__controls">
        <button type="button" aria-label="Minimize" @click.stop="emit('minimize')">_</button>
        <button type="button" aria-label="Close" @click.stop="emit('close')">×</button>
      </div>
    </header>
    <div class="window__body">
      <slot />
    </div>
  </article>
</template>

<style scoped>
.window {
  position: absolute;
  display: flex;
  width: min(620px, 75vw);
  min-height: 260px;
  flex-direction: column;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  box-shadow: 2px 2px #000;
}

.window--dragging {
  cursor: grabbing;
}

.window--compact {
  width: fit-content;
  min-width: 0;
}

.window__titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 26px;
  padding: 2px 3px 2px 6px;
  color: #fff;
  background: #000080;
  font-weight: bold;
}

.window__title,
.window__controls {
  display: flex;
  align-items: center;
}

.window__title {
  gap: 6px;
  overflow: hidden;
}

.window__title img {
  width: 18px;
  height: 18px;
}

.window__title span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.window__controls {
  gap: 2px;
}

.window__controls button {
  width: 22px;
  height: 22px;
  padding: 0;
  color: #000;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  font: inherit;
  font-weight: bold;
  line-height: 16px;
}

.window__body {
  flex: 1;
  padding: 16px;
  overflow: auto;
  background: #fff;
}

.window--compact .window__body {
  padding: 0;
  background: #c3c3c3;
}
</style>
