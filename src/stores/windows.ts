// stores/windows.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface OsWindow {
  id: string
  title: string
  icon: string
  folder: 'about' | 'contact' | 'projects' | 'minesweeper'
  minimized: boolean
  zIndex: number
  position: { x: number; y: number }
}

export const useWindowsStore = defineStore('windows', () => {
  const windows = ref<OsWindow[]>([])
  const activeId = ref<string | null>(null)
  let topZ = 1

  function open(win: Omit<OsWindow, 'minimized' | 'zIndex' | 'position'>) {
    const existing = windows.value.find(w => w.id === win.id)
    if (existing) return focus(existing.id)
    const offset = windows.value.length * 24
    windows.value.push({
      ...win,
      minimized: false,
      zIndex: ++topZ,
      position: { x: 160 + offset, y: 80 + offset },
    })
    activeId.value = win.id
  }

  function focus(id: string) {
    const w = windows.value.find(w => w.id === id)
    if (!w) return
    w.minimized = false
    w.zIndex = ++topZ
    activeId.value = id
  }

  function minimize(id: string) {
    const w = windows.value.find(w => w.id === id)
    if (w) w.minimized = true
    if (activeId.value === id) activeId.value = null
  }

  function move(id: string, position: { x: number; y: number }) {
    const window = windows.value.find(w => w.id === id)
    if (window) window.position = position
  }

  function close(id: string) {
    windows.value = windows.value.filter(w => w.id !== id)
    if (activeId.value === id) activeId.value = null
  }

  return { windows, activeId, open, focus, minimize, move, close }
})