<script setup lang="ts">
import { ref, computed, type Component } from 'vue'

import Taskbar from '../Taskbar.vue'
import DesktopIcon from './DesktopIcon.vue'
import WindowFrame from '../windows/Frame.vue'
import About from '../windows/About.vue'
import Contact from '../windows/Contact.vue'
import Projects from '../windows/Projects.vue'
import Minesweeper from '../windows/Minesweeper.vue'
import wordpadIcon from '../../assets/wordpad.ico'
import contactIcon from '../../assets/contact.ico'
import paint from '../../assets/paint.ico'
import { useI18n } from '../../i18n'
import { useWindowsStore, type OsWindow } from '../../stores/windows'

const desktop = ref<HTMLElement | null>(null)
const { messages } = useI18n()
const windows = useWindowsStore()

const windowComponents: Record<OsWindow['folder'], Component> = {
  about: About,
  contact: Contact,
  projects: Projects,
  minesweeper: Minesweeper,
}

const icons = ref([
  { id: 'about', icon: wordpadIcon, x: 24, y: 24 },
  { id: 'contact', icon: contactIcon, x: 24, y: 108 },
  { id: 'projects', icon: paint, x: 24, y: 192 },
])

const translatedIcons = computed(() =>
  icons.value.map((icon) => ({
    ...icon,
    label: messages.value[icon.id as 'about' | 'contact' | 'projects'],
  })),
)

const selectedIcons = ref<string[]>([])
const selecting = ref(false)
const start = ref({ x: 0, y: 0 })
const current = ref({ x: 0, y: 0 })

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

const selectionBounds = computed(() => ({
  left: Math.min(start.value.x, current.value.x),
  top: Math.min(start.value.y, current.value.y),
  right: Math.max(start.value.x, current.value.x),
  bottom: Math.max(start.value.y, current.value.y),
}))

function pointFromEvent(e: PointerEvent) {
  const rect = desktop.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onPointerDown(e: PointerEvent) {
  // solo si se pulsa el fondo, no un icono ni una ventana
  if (e.button == 2) return
  if (e.target !== desktop.value) return
  selectedIcons.value = []
  selecting.value = true
  start.value = current.value = pointFromEvent(e)
  desktop.value!.setPointerCapture(e.pointerId) 
}

function onPointerMove(e: PointerEvent) {
  if (e.button == 2) return
  if (!selecting.value) return
  current.value = pointFromEvent(e)
  selectedIcons.value = icons.value
    .filter((icon) => isIconSelected(icon))
    .map((icon) => icon.id)
}

function onPointerUp() {
  selecting.value = false
}

function selectIcon(id: string) {
  if (selectedIcons.value.includes(id)) return
  selectedIcons.value = [id]
}

function openIcon(icon: (typeof icons.value)[number]) {
  windows.open({
    id: icon.id,
    title: messages.value[icon.id as 'about' | 'contact' | 'projects'],
    icon: icon.icon,
    folder: icon.id as 'about' | 'contact' | 'projects'
  })
}

function isIconSelected(icon: { x: number; y: number }) {
  const iconWidth = 100
  const iconHeight = 80
  const bounds = selectionBounds.value

  return (
    icon.x < bounds.right &&
    icon.x + iconWidth > bounds.left &&
    icon.y < bounds.bottom &&
    icon.y + iconHeight > bounds.top
  )
}

function moveIcon(id: string, delta: { x: number; y: number }) {
  if (!desktop.value) return

  const iconWidth = 76
  const iconHeight = 68
  const maxX = Math.max(0, desktop.value.clientWidth - iconWidth)
  const maxY = Math.max(0, desktop.value.clientHeight - iconHeight)

  const idsToMove = selectedIcons.value.includes(id) ? selectedIcons.value : [id]
  const iconsToMove = icons.value.filter((icon) => idsToMove.includes(icon.id))
  if (iconsToMove.length === 0) return

  const minDelta = {
    x: Math.max(...iconsToMove.map((icon) => -icon.x)),
    y: Math.max(...iconsToMove.map((icon) => -icon.y)),
  }
  const maxDelta = {
    x: Math.min(...iconsToMove.map((icon) => maxX - icon.x)),
    y: Math.min(...iconsToMove.map((icon) => maxY - icon.y)),
  }

  const clampedDelta = {
    x: Math.min(maxDelta.x, Math.max(minDelta.x, delta.x)),
    y: Math.min(maxDelta.y, Math.max(minDelta.y, delta.y)),
  }

  iconsToMove.forEach((icon) => {
    icon.x += clampedDelta.x
    icon.y += clampedDelta.y
  })
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
    <DesktopIcon
      v-for="icon in translatedIcons"
      :key="icon.id"
      v-bind="icon"
      :selected="selectedIcons.includes(icon.id)"
      @select="selectIcon(icon.id)"
      @move="moveIcon(icon.id, $event)"
      @open="openIcon(icon)"
    />
    <div v-if="selecting" class="selection" :style="selectionStyle" />
    <WindowFrame
      v-for="window in windows.windows"
      v-show="!window.minimized"
      :key="window.id"
      :title="messages[window.folder]"
      :icon="window.icon"
      :z-index="10000 + window.zIndex"
      :position="window.position"
      :compact="window.folder === 'minesweeper'"
      @close="windows.close(window.id)"
      @minimize="windows.minimize(window.id)"
      @focus="windows.focus(window.id)"
      @move="windows.move(window.id, $event)"
    >
      <component :is="windowComponents[window.folder]" />
    </WindowFrame>
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
  background: rgba(0, 0, 128, 0.15);
  pointer-events: none;
}
</style>
