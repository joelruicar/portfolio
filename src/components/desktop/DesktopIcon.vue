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
const moved = ref(false)
const pointer = ref({ x: 0, y: 0 })

function onPointerDown(event: PointerEvent) {
  event.preventDefault()
  emit('select')
  dragging.value = true
  moved.value = false
  pointer.value = { x: event.clientX, y: event.clientY }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return

  if (Math.hypot(event.clientX - pointer.value.x, event.clientY - pointer.value.y) > 3) {
    moved.value = true
  }

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

  if (event.pointerType === 'touch' && !moved.value) {
    emit('open')
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
    @dragstart.prevent
    @dblclick.stop="emit('open')"
  >
    <img
      v-if="icon.endsWith('.ico')"
      class="icon"
      :src="icon"
      alt=""
      draggable="false"
    />
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
  cursor: pointer;
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
  pointer-events: none;
}

.label {
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
