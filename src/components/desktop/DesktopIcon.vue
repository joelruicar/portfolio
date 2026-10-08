<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  label: string
  icon: string
  x: number
  y: number
  selected: boolean
}>()

const emit = defineEmits<{
  select: []
  open: []
  move: [delta: { x: number; y: number }]
}>()

const dragging = ref(false)
const pointer = ref({ x: 0, y: 0 })

function onPointerDown(event: PointerEvent) {
  emit('select')
  dragging.value = true
  pointer.value = { x: event.clientX, y: event.clientY }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return

  emit('move', {
    x: event.clientX - pointer.value.x,
    y: event.clientY - pointer.value.y,
  })
  pointer.value = { x: event.clientX, y: event.clientY }
}

function onPointerUp(event: PointerEvent) {
  dragging.value = false
  const target = event.currentTarget as HTMLElement
  if (target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId)
  }
}
</script>

<template>
  <button
    class="desktop-icon"
    :class="{ dragging, selected }"
    :style="{ left: `${x}px`, top: `${y}px` }"
    type="button"
    @pointerdown.stop="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @dblclick.stop="emit('open')"
  >
    <img v-if="icon.endsWith('.ico')" class="icon" :src="icon" alt="" />
    <span v-else class="icon" aria-hidden="true">{{ icon }}</span>
    <span class="label">{{ label }}</span>
  </button>
</template>

<style scoped>
.desktop-icon {
  position: absolute;
  display: flex;
  width: 100px;
  min-height: 80px;
  padding: 4px;
  flex-direction: column;
  align-items: center;
  border: 1px solid transparent;
  color: #fff;
  background: transparent;
  font: inherit;
  cursor: default;
  touch-action: none;
}

.desktop-icon:hover,
.desktop-icon.dragging,
.desktop-icon.selected {
  border-color: #fff;
  background: rgba(0, 0, 128, 0.35);
}

.icon {
  width: 32px;
  height: 32px;
  font-size: 32px;
  line-height: 32px;
  object-fit: contain;
}

.label {
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
