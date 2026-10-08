<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'

const emit = defineEmits<{
  close: []
  minimize: []
  focus: []
  move: [position: { x: number; y: number }]
}>()

const titlebar = ref<HTMLElement | null>(null)
const dragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const maximized = ref(false)
const size = ref<{ width: number; height: number } | null>(null)
const resizing = ref(false)
const resizeDirection = ref('')
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 })

const props = defineProps<{
  title: string
  icon: string
  zIndex: number
  position: { x: number; y: number }
  compact?: boolean
}>()

const windowStyle = computed(() => {
  if (maximized.value) return { zIndex: props.zIndex }

  return {
    zIndex: props.zIndex,
    left: `${props.position.x}px`,
    top: `${props.position.y}px`,
    ...(size.value
      ? { width: `${size.value.width}px`, height: `${size.value.height}px` }
      : {}),
  }
})

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

function toggleMaximize() {
  maximized.value = !maximized.value
  resizing.value = false
  emit('focus')
}

function startResize(event: PointerEvent, direction: string) {
  if (event.button !== 0 || maximized.value) return

  const frame = (event.currentTarget as HTMLElement).closest('.window') as HTMLElement | null
  if (!frame) return

  const rect = frame.getBoundingClientRect()
  resizeDirection.value = direction
  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    width: rect.width,
    height: rect.height,
    left: rect.left,
    top: rect.top,
  }
  resizing.value = true
  emit('focus')
  window.addEventListener('pointermove', resize)
  window.addEventListener('pointerup', endResize, { once: true })
}

function resize(event: PointerEvent) {
  if (!resizing.value) return

  const start = resizeStart.value
  const direction = resizeDirection.value
  const minWidth = props.compact ? 180 : 260
  const minHeight = props.compact ? 160 : 180
  let width = start.width
  let height = start.height
  let left = props.position.x
  let top = props.position.y

  if (direction.includes('e')) width = Math.max(minWidth, start.width + event.clientX - start.x)
  if (direction.includes('s')) height = Math.max(minHeight, start.height + event.clientY - start.y)
  if (direction.includes('w')) {
    width = Math.max(minWidth, start.width - event.clientX + start.x)
    left = props.position.x + start.width - width
  }
  if (direction.includes('n')) {
    height = Math.max(minHeight, start.height - event.clientY + start.y)
    top = props.position.y + start.height - height
  }

  size.value = { width, height }
  if (direction.includes('w') || direction.includes('n')) {
    emit('move', { x: Math.max(0, left), y: Math.max(0, top) })
  }
}

function endResize() {
  resizing.value = false
  resizeDirection.value = ''
  window.removeEventListener('pointermove', resize)
}

onUnmounted(() => {
  window.removeEventListener('pointermove', resize)
  window.removeEventListener('pointerup', endResize)
})
</script>

<template>
  <article
    class="window"
    :class="{ 'window--dragging': dragging, 'window--resizing': resizing, 'window--maximized': maximized, 'window--compact': compact }"
    :style="windowStyle"
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
        <button
          type="button"
          :aria-label="maximized ? 'Restore' : 'Maximize'"
          @click.stop="toggleMaximize"
        >{{ maximized ? '❐' : '□' }}</button>
        <button type="button" aria-label="Close" @click.stop="emit('close')">×</button>
      </div>
    </header>
    <div class="window__body">
      <slot />
    </div>
    <span
      v-for="direction in ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']"
      :key="direction"
      class="window__resize-handle"
      :class="`window__resize-handle--${direction}`"
      @pointerdown.stop="startResize($event, direction)"
    />
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

.window--resizing {
  user-select: none;
}

.window--maximized {
  inset: 0 0 35px;
  width: auto !important;
  height: auto !important;
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

.window__resize-handle {
  position: absolute;
  z-index: 2;
}

.window__resize-handle--n,
.window__resize-handle--s {
  right: 5px;
  left: 5px;
  height: 5px;
  cursor: ns-resize;
}

.window__resize-handle--n {
  top: -3px;
}

.window__resize-handle--s {
  bottom: -3px;
}

.window__resize-handle--e,
.window__resize-handle--w {
  top: 5px;
  bottom: 5px;
  width: 5px;
  cursor: ew-resize;
}

.window__resize-handle--e {
  right: -3px;
}

.window__resize-handle--w {
  left: -3px;
}

.window__resize-handle--ne,
.window__resize-handle--sw {
  width: 8px;
  height: 8px;
  cursor: nesw-resize;
}

.window__resize-handle--ne {
  top: -3px;
  right: -3px;
}

.window__resize-handle--sw {
  bottom: -3px;
  left: -3px;
}

.window__resize-handle--nw,
.window__resize-handle--se {
  width: 8px;
  height: 8px;
  cursor: nwse-resize;
}

.window__resize-handle--nw {
  top: -3px;
  left: -3px;
}

.window__resize-handle--se {
  right: -3px;
  bottom: -3px;
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
