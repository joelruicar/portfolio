<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useI18n } from '../../i18n'

const emit = defineEmits<{
  close: []
}>()

const { messages, locale } = useI18n()

// Tools definition
export type PaintTool =
  | 'star_select'
  | 'rect_select'
  | 'eraser'
  | 'bucket'
  | 'picker'
  | 'magnifier'
  | 'pencil'
  | 'brush'
  | 'airbrush'
  | 'text'
  | 'line'
  | 'curve'
  | 'rect'
  | 'polygon'
  | 'ellipse'
  | 'round_rect'

const activeTool = ref<PaintTool>('pencil')
const prevTool = ref<PaintTool>('pencil')

// Colors
const primaryColor = ref('#000000') // Left click (Foreground)
const secondaryColor = ref('#ffffff') // Right click (Background)

// Tool Modifiers
const brushSize = ref(4)
const brushShape = ref<'round' | 'square' | 'slash_left' | 'slash_right'>('round')
const eraserSize = ref(8)
const airbrushRadius = ref(12)
const lineWidth = ref(2)
const shapeMode = ref<'stroke' | 'stroke_fill' | 'fill'>('stroke')
const selectionTransparent = ref(false)
const zoomLevel = ref(1)

// Canvas references & contexts
const viewportEl = ref<HTMLElement | null>(null)
const mainCanvas = ref<HTMLCanvasElement | null>(null)
const overlayCanvas = ref<HTMLCanvasElement | null>(null)
const mainCtx = ref<CanvasRenderingContext2D | null>(null)
const overlayCtx = ref<CanvasRenderingContext2D | null>(null)

// Dimensions of canvas (dynamically resized with screen)
const canvasWidth = ref(560)
const canvasHeight = ref(340)

// Cursor & status
const mouseCoords = ref<{ x: number; y: number } | null>(null)
const shapeBox = ref<{ w: number; h: number } | null>(null)
const hoveredTool = ref<PaintTool | null>(null)

// History (Undo / Redo)
const undoStack = ref<ImageData[]>([])
const redoStack = ref<ImageData[]>([])
const MAX_HISTORY = 20

// Menu states
const activeMenu = ref<string | null>(null)
const showAboutModal = ref(false)

// Drawing State Machine
let isPointerDown = false
let activeMouseButton = 0 // 0 = left, 2 = right
let startPoint = { x: 0, y: 0 }
let lastPoint = { x: 0, y: 0 }
let sprayTimer: number | null = null
let resizeObserver: ResizeObserver | null = null

// Text Tool state
const textInput = ref<{
  visible: boolean
  x: number
  y: number
  text: string
  fontSize: number
}>({
  visible: false,
  x: 0,
  y: 0,
  text: '',
  fontSize: 16,
})
const textInputEl = ref<HTMLInputElement | null>(null)

// Selection State
interface SelectionData {
  active: boolean
  x: number
  y: number
  w: number
  h: number
  imageData: ImageData | null
  dragging: boolean
  dragOffset: { x: number; y: number }
}
const selection = ref<SelectionData>({
  active: false,
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  imageData: null,
  dragging: false,
  dragOffset: { x: 0, y: 0 },
})

// 28 Classic Windows Paint Colors
const paletteColors: string[] = [
  // Row 1
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080',
  '#800080', '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
  // Row 2
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff',
  '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040',
]

const currentStatus = computed(() => {
  if (hoveredTool.value) {
    return messages.value.paint.tools[hoveredTool.value]?.desc ?? ''
  }
  return messages.value.paint.statusHelp
})

// Dynamic canvas resizing matching viewport & screen size
function updateCanvasSize() {
  if (!viewportEl.value) return
  const rect = viewportEl.value.getBoundingClientRect()
  const targetW = Math.max(260, Math.floor(rect.width - 8))
  const isSingleCol = targetW < 520
  const minH = isSingleCol ? 460 : 320
  const targetH = Math.max(minH, Math.floor(rect.height - 8))

  if (targetW !== canvasWidth.value || targetH !== canvasHeight.value) {
    const hasUserDrawn = undoStack.value.length > 1
    let prevData: ImageData | null = null

    if (hasUserDrawn && mainCtx.value && mainCanvas.value) {
      prevData = mainCtx.value.getImageData(0, 0, mainCanvas.value.width, mainCanvas.value.height)
    }

    canvasWidth.value = targetW
    canvasHeight.value = targetH

    nextTick(() => {
      if (mainCtx.value) {
        if (hasUserDrawn && prevData) {
          mainCtx.value.fillStyle = '#ffffff'
          mainCtx.value.fillRect(0, 0, canvasWidth.value, canvasHeight.value)
          mainCtx.value.putImageData(prevData, 0, 0)
        } else {
          drawInitialSkills()
        }
      }
    })
  }
}

function getCanvasCoords(e: PointerEvent | MouseEvent): { x: number; y: number } {
  if (!mainCanvas.value) return { x: 0, y: 0 }
  const rect = mainCanvas.value.getBoundingClientRect()
  const scaleX = mainCanvas.value.width / rect.width
  const scaleY = mainCanvas.value.height / rect.height
  return {
    x: Math.round((e.clientX - rect.left) * scaleX),
    y: Math.round((e.clientY - rect.top) * scaleY),
  }
}

// History Management
function pushHistory() {
  if (!mainCtx.value || !mainCanvas.value) return
  const imgData = mainCtx.value.getImageData(0, 0, mainCanvas.value.width, mainCanvas.value.height)
  undoStack.value.push(imgData)
  if (undoStack.value.length > MAX_HISTORY) {
    undoStack.value.shift()
  }
  redoStack.value = []
}

function handleUndo() {
  if (undoStack.value.length <= 1 || !mainCtx.value) return
  const current = undoStack.value.pop()!
  redoStack.value.push(current)
  const prev = undoStack.value[undoStack.value.length - 1]
  mainCtx.value.putImageData(prev, 0, 0)
}

function handleRedo() {
  if (redoStack.value.length === 0 || !mainCtx.value) return
  const next = redoStack.value.pop()!
  undoStack.value.push(next)
  mainCtx.value.putImageData(next, 0, 0)
}

// Tool Selection
function selectTool(tool: PaintTool) {
  if (selection.value.active) {
    commitSelection()
  }
  if (textInput.value.visible) {
    commitText()
  }
  prevTool.value = activeTool.value
  activeTool.value = tool
}

// Color Selection
function setPrimary(color: string) {
  primaryColor.value = color
}

function setSecondary(color: string) {
  secondaryColor.value = color
}

// Canvas Initialization with Skills Artwork
function drawInitialSkills() {
  if (!mainCtx.value || !mainCanvas.value) return
  const ctx = mainCtx.value
  const w = mainCanvas.value.width
  const h = mainCanvas.value.height
  const isSingleCol = w < 520

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  // Title Banner (Retro 3D Ribbon)
  const titleH = isSingleCol ? 32 : 36
  ctx.fillStyle = '#000080'
  ctx.fillRect(12, 12, w - 24, titleH)
  ctx.fillStyle = '#1084d0'
  ctx.fillRect(14, 14, w - 28, titleH - 4)
  ctx.fillStyle = '#ffffff'
  ctx.font = isSingleCol
    ? 'bold 14px w95fa, "Courier New", monospace'
    : 'bold 20px w95fa, "Courier New", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(messages.value.paint.canvas.title, w / 2, isSingleCol ? 33 : 37)

  // Skill Badges Grid from i18n
  const skills = messages.value.paint.canvas.skills

  if (isSingleCol) {
    // -------------------------------------------------------------
    // 1 COLUMNA (MOBILE / ANCHO REDUCIDO)
    // -------------------------------------------------------------
    const startY = 54
    const boxW = w - 24
    const boxH = 48
    const gapY = 8

    skills.forEach((skill, i) => {
      const bx = 12
      const by = startY + i * (boxH + gapY)

      // Card frame
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(bx, by, boxW, boxH)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(bx, by, boxW, 2)
      ctx.fillRect(bx, by, 2, boxH)
      ctx.fillStyle = '#808080'
      ctx.fillRect(bx, by + boxH - 2, boxW, 2)
      ctx.fillRect(bx + boxW - 2, by, 2, boxH)

      // Color pill
      ctx.fillStyle = skill.color
      ctx.fillRect(bx + 8, by + 8, 8, boxH - 16)

      // Text
      ctx.textAlign = 'left'
      ctx.fillStyle = '#000080'
      ctx.font = 'bold 12px w95fa, sans-serif'
      ctx.fillText(skill.title, bx + 22, by + 19)

      ctx.fillStyle = '#333333'
      ctx.font = '10px w95fa, sans-serif'
      ctx.fillText(skill.desc, bx + 22, by + 34)
    })

    // Doodles at the bottom
    const bottomY = startY + skills.length * (boxH + gapY) + 12
    // Smiley
    ctx.fillStyle = '#ffff00'
    ctx.beginPath()
    ctx.arc(36, bottomY + 16, 13, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(31, bottomY + 13, 2, 0, Math.PI * 2)
    ctx.arc(41, bottomY + 13, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(36, bottomY + 16, 6, 0.2, Math.PI - 0.2)
    ctx.stroke()

    // Palette doodle on right
    ctx.save()
    const px = w - 36
    const py = bottomY + 16
    ctx.fillStyle = '#d2a679'
    ctx.beginPath()
    ctx.arc(px, py, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(px + 4, py + 4, 4, 0, Math.PI * 2)
    ctx.fill()
    const dotColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
    dotColors.forEach((c, idx) => {
      ctx.fillStyle = c
      const angle = (idx * Math.PI) / 2
      ctx.beginPath()
      ctx.arc(px + Math.cos(angle) * 9, py + Math.sin(angle) * 9, 2, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()

    // Note
    ctx.fillStyle = '#555555'
    ctx.font = 'italic 11px w95fa, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(messages.value.paint.canvas.hint, w / 2, bottomY + 20)
  } else {
    // -------------------------------------------------------------
    // 2 COLUMNAS (PANTALLA ANCHA / DESKTOP)
    // -------------------------------------------------------------
    const startY = 68
    const boxW = Math.min(260, Math.floor((w - 56) / 2))
    const boxH = 50
    const gapX = Math.max(12, Math.floor(w - 2 * boxW - 52))
    const gapY = 14

    skills.forEach((skill, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const bx = 26 + col * (boxW + gapX)
      const by = startY + row * (boxH + gapY)

      // Retro button / card frame
      ctx.fillStyle = '#e8e8e8'
      ctx.fillRect(bx, by, boxW, boxH)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(bx, by, boxW, 2)
      ctx.fillRect(bx, by, 2, boxH)
      ctx.fillStyle = '#808080'
      ctx.fillRect(bx, by + boxH - 2, boxW, 2)
      ctx.fillRect(bx + boxW - 2, by, 2, boxH)

      // Color pill
      ctx.fillStyle = skill.color
      ctx.fillRect(bx + 8, by + 10, 10, boxH - 20)

      // Skill text
      ctx.textAlign = 'left'
      ctx.fillStyle = '#000080'
      ctx.font = 'bold 14px w95fa, sans-serif'
      ctx.fillText(skill.title, bx + 26, by + 22)

      ctx.fillStyle = '#333333'
      ctx.font = '11px w95fa, sans-serif'
      ctx.fillText(skill.desc, bx + 26, by + 38)
    })

    // Doodles on desktop
    ctx.save()
    const px = w - 46
    const py = h - 45
    ctx.fillStyle = '#d2a679'
    ctx.beginPath()
    ctx.arc(px, py, 26, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(px + 10, py + 10, 8, 0, Math.PI * 2)
    ctx.fill()
    const dotColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
    dotColors.forEach((c, idx) => {
      ctx.fillStyle = c
      const angle = (idx * Math.PI) / 3 - 0.5
      ctx.beginPath()
      ctx.arc(px + Math.cos(angle) * 16, py + Math.sin(angle) * 16, 4, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()

    // Smiley face doodle
    ctx.fillStyle = '#ffff00'
    ctx.beginPath()
    ctx.arc(44, h - 42, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(38, h - 46, 2, 0, Math.PI * 2)
    ctx.arc(50, h - 46, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(44, h - 42, 9, 0.2, Math.PI - 0.2)
    ctx.stroke()

    // Footer friendly hint
    ctx.fillStyle = '#606060'
    ctx.font = 'italic 12px w95fa, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(messages.value.paint.canvas.hint, w / 2, h - 22)
  }

  undoStack.value = []
  redoStack.value = []
  pushHistory()
}

// Watch locale to update canvas when language is changed
watch(locale, () => {
  if (undoStack.value.length <= 1) {
    drawInitialSkills()
  }
})

// Flood Fill Algorithm (Stack-based BFS)
function floodFill(startX: number, startY: number, fillHex: string) {
  if (!mainCtx.value || !mainCanvas.value) return
  const ctx = mainCtx.value
  const w = mainCanvas.value.width
  const h = mainCanvas.value.height

  if (startX < 0 || startX >= w || startY < 0 || startY >= h) return

  const imgData = ctx.getImageData(0, 0, w, h)
  const data = imgData.data

  const fillR = parseInt(fillHex.slice(1, 3), 16)
  const fillG = parseInt(fillHex.slice(3, 5), 16)
  const fillB = parseInt(fillHex.slice(5, 7), 16)
  const fillA = 255

  const startIdx = (startY * w + startX) * 4
  const targetR = data[startIdx]
  const targetG = data[startIdx + 1]
  const targetB = data[startIdx + 2]
  const targetA = data[startIdx + 3]

  if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === fillA) {
    return
  }

  const match = (idx: number) => {
    return (
      Math.abs(data[idx] - targetR) < 16 &&
      Math.abs(data[idx + 1] - targetG) < 16 &&
      Math.abs(data[idx + 2] - targetB) < 16 &&
      Math.abs(data[idx + 3] - targetA) < 16
    )
  }

  const visited = new Uint8Array(w * h)
  const stack: [number, number][] = [[startX, startY]]
  visited[startY * w + startX] = 1

  while (stack.length > 0) {
    const [x, y] = stack.pop()!
    const idx = (y * w + x) * 4

    data[idx] = fillR
    data[idx + 1] = fillG
    data[idx + 2] = fillB
    data[idx + 3] = fillA

    const neighbors: [number, number][] = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nPos = ny * w + nx
        if (!visited[nPos]) {
          visited[nPos] = 1
          const nIdx = nPos * 4
          if (match(nIdx)) {
            stack.push([nx, ny])
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0)
  pushHistory()
}

// Spray / Airbrush simulation
function sprayAt(x: number, y: number, color: string) {
  if (!mainCtx.value) return
  const ctx = mainCtx.value
  ctx.fillStyle = color
  const radius = airbrushRadius.value
  const density = Math.round(radius * 1.5)

  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * radius
    const px = Math.round(x + Math.cos(angle) * dist)
    const py = Math.round(y + Math.sin(angle) * dist)
    ctx.fillRect(px, py, 1, 1)
  }
}

// Shape Drawing Helper
function drawShape(
  ctx: CanvasRenderingContext2D,
  type: PaintTool,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  strokeCol: string,
  fillCol: string,
) {
  const x = Math.min(x0, x1)
  const y = Math.min(y0, y1)
  const w = Math.abs(x1 - x0)
  const h = Math.abs(y1 - y0)

  ctx.lineWidth = lineWidth.value
  ctx.strokeStyle = strokeCol
  ctx.fillStyle = fillCol

  ctx.beginPath()

  if (type === 'line' || type === 'curve') {
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
    return
  }

  if (type === 'rect') {
    if (shapeMode.value === 'fill') {
      ctx.fillRect(x, y, w, h)
    } else if (shapeMode.value === 'stroke_fill') {
      ctx.fillRect(x, y, w, h)
      ctx.strokeRect(x, y, w, h)
    } else {
      ctx.strokeRect(x, y, w, h)
    }
    return
  }

  if (type === 'round_rect') {
    const r = Math.min(12, w / 3, h / 3)
    ctx.roundRect(x, y, w, h, r)
    if (shapeMode.value === 'fill') {
      ctx.fill()
    } else if (shapeMode.value === 'stroke_fill') {
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.stroke()
    }
    return
  }

  if (type === 'ellipse') {
    const cx = x + w / 2
    const cy = y + h / 2
    ctx.ellipse(cx, cy, Math.max(0.1, w / 2), Math.max(0.1, h / 2), 0, 0, Math.PI * 2)
    if (shapeMode.value === 'fill') {
      ctx.fill()
    } else if (shapeMode.value === 'stroke_fill') {
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.stroke()
    }
    return
  }
}

// Pointer Event Handlers
function onPointerDown(e: PointerEvent) {
  if (!mainCanvas.value || !mainCtx.value) return
  if (e.button !== 0 && e.button !== 2) return

  e.preventDefault()
  activeMouseButton = e.button
  isPointerDown = true
  const coords = getCanvasCoords(e)
  startPoint = coords
  lastPoint = coords

  const currentColor = activeMouseButton === 2 ? secondaryColor.value : primaryColor.value

  // Magnifier Tool
  if (activeTool.value === 'magnifier') {
    if (e.button === 0) {
      zoomLevel.value = zoomLevel.value === 1 ? 2 : zoomLevel.value === 2 ? 4 : 1
    } else {
      zoomLevel.value = 1
    }
    return
  }

  // Eyedropper Tool
  if (activeTool.value === 'picker') {
    const pixel = mainCtx.value.getImageData(coords.x, coords.y, 1, 1).data
    const hex =
      '#' +
      [pixel[0], pixel[1], pixel[2]]
        .map((n) => n.toString(16).padStart(2, '0'))
        .join('')
    if (activeMouseButton === 2) {
      setSecondary(hex)
    } else {
      setPrimary(hex)
    }
    activeTool.value = prevTool.value
    return
  }

  // Paint Bucket Tool
  if (activeTool.value === 'bucket') {
    floodFill(coords.x, coords.y, currentColor)
    return
  }

  // Text Tool
  if (activeTool.value === 'text') {
    if (textInput.value.visible) {
      commitText()
    } else {
      textInput.value = {
        visible: true,
        x: coords.x,
        y: coords.y,
        text: '',
        fontSize: 16,
      }
      nextTick(() => textInputEl.value?.focus())
    }
    return
  }

  // Selection Dragging
  if (selection.value.active && (activeTool.value === 'rect_select' || activeTool.value === 'star_select')) {
    const s = selection.value
    if (coords.x >= s.x && coords.x <= s.x + s.w && coords.y >= s.y && coords.y <= s.y + s.h) {
      s.dragging = true
      s.dragOffset = { x: coords.x - s.x, y: coords.y - s.y }
      return
    } else {
      commitSelection()
    }
  }

  // Eraser Tool
  if (activeTool.value === 'eraser') {
    mainCtx.value.fillStyle = secondaryColor.value
    const size = eraserSize.value
    mainCtx.value.fillRect(coords.x - size / 2, coords.y - size / 2, size, size)
  }

  // Pencil Tool
  if (activeTool.value === 'pencil') {
    mainCtx.value.strokeStyle = currentColor
    mainCtx.value.lineWidth = 1
    mainCtx.value.lineCap = 'square'
    mainCtx.value.beginPath()
    mainCtx.value.moveTo(coords.x, coords.y)
    mainCtx.value.lineTo(coords.x, coords.y)
    mainCtx.value.stroke()
  }

  // Brush Tool
  if (activeTool.value === 'brush') {
    mainCtx.value.strokeStyle = currentColor
    mainCtx.value.lineWidth = brushSize.value
    mainCtx.value.lineCap = brushShape.value === 'square' ? 'square' : 'round'
    mainCtx.value.lineJoin = 'round'
    mainCtx.value.beginPath()
    mainCtx.value.moveTo(coords.x, coords.y)
    mainCtx.value.lineTo(coords.x, coords.y)
    mainCtx.value.stroke()
  }

  // Airbrush Tool
  if (activeTool.value === 'airbrush') {
    sprayAt(coords.x, coords.y, currentColor)
    sprayTimer = window.setInterval(() => {
      sprayAt(lastPoint.x, lastPoint.y, currentColor)
    }, 40)
  }
}

function onPointerMove(e: PointerEvent) {
  const coords = getCanvasCoords(e)
  mouseCoords.value = coords

  if (!isPointerDown) {
    if (activeTool.value === 'eraser' && overlayCtx.value && overlayCanvas.value) {
      overlayCtx.value.clearRect(0, 0, overlayCanvas.value.width, overlayCanvas.value.height)
      overlayCtx.value.strokeStyle = '#000000'
      overlayCtx.value.lineWidth = 1
      const s = eraserSize.value
      overlayCtx.value.strokeRect(coords.x - s / 2, coords.y - s / 2, s, s)
    }
    return
  }

  const currentColor = activeMouseButton === 2 ? secondaryColor.value : primaryColor.value
  const altColor = activeMouseButton === 2 ? primaryColor.value : secondaryColor.value

  shapeBox.value = {
    w: Math.abs(coords.x - startPoint.x),
    h: Math.abs(coords.y - startPoint.y),
  }

  // Selection Moving
  if (selection.value.dragging && (activeTool.value === 'rect_select' || activeTool.value === 'star_select')) {
    selection.value.x = coords.x - selection.value.dragOffset.x
    selection.value.y = coords.y - selection.value.dragOffset.y
    renderSelectionOverlay()
    return
  }

  // Freehand Drawing
  if (activeTool.value === 'pencil') {
    if (mainCtx.value) {
      mainCtx.value.beginPath()
      mainCtx.value.moveTo(lastPoint.x, lastPoint.y)
      mainCtx.value.lineTo(coords.x, coords.y)
      mainCtx.value.stroke()
    }
  } else if (activeTool.value === 'brush') {
    if (mainCtx.value) {
      mainCtx.value.beginPath()
      mainCtx.value.moveTo(lastPoint.x, lastPoint.y)
      mainCtx.value.lineTo(coords.x, coords.y)
      mainCtx.value.stroke()
    }
  } else if (activeTool.value === 'eraser') {
    if (mainCtx.value) {
      const size = eraserSize.value
      mainCtx.value.fillStyle = secondaryColor.value
      mainCtx.value.fillRect(coords.x - size / 2, coords.y - size / 2, size, size)
    }
  } else if (activeTool.value === 'airbrush') {
    sprayAt(coords.x, coords.y, currentColor)
  }

  // Shape Previews on Overlay Canvas
  if (['line', 'rect', 'round_rect', 'ellipse', 'curve'].includes(activeTool.value)) {
    if (overlayCtx.value && overlayCanvas.value) {
      overlayCtx.value.clearRect(0, 0, overlayCanvas.value.width, overlayCanvas.value.height)
      drawShape(
        overlayCtx.value,
        activeTool.value,
        startPoint.x,
        startPoint.y,
        coords.x,
        coords.y,
        currentColor,
        altColor,
      )
    }
  }

  // Marquee Selection Box
  if (activeTool.value === 'rect_select' || activeTool.value === 'star_select') {
    if (!selection.value.active && overlayCtx.value && overlayCanvas.value) {
      overlayCtx.value.clearRect(0, 0, overlayCanvas.value.width, overlayCanvas.value.height)
      overlayCtx.value.strokeStyle = '#000000'
      overlayCtx.value.lineWidth = 1
      overlayCtx.value.setLineDash([3, 3])
      const sx = Math.min(startPoint.x, coords.x)
      const sy = Math.min(startPoint.y, coords.y)
      const sw = Math.abs(coords.x - startPoint.x)
      const sh = Math.abs(coords.y - startPoint.y)
      overlayCtx.value.strokeRect(sx, sy, sw, sh)
      overlayCtx.value.setLineDash([])
    }
  }

  lastPoint = coords
}

function onPointerUp(e: PointerEvent) {
  if (!isPointerDown) return
  isPointerDown = false

  if (sprayTimer !== null) {
    clearInterval(sprayTimer)
    sprayTimer = null
  }

  const coords = getCanvasCoords(e)
  const currentColor = activeMouseButton === 2 ? secondaryColor.value : primaryColor.value
  const altColor = activeMouseButton === 2 ? primaryColor.value : secondaryColor.value

  shapeBox.value = null

  // Selection tool release
  if (activeTool.value === 'rect_select' || activeTool.value === 'star_select') {
    if (selection.value.dragging) {
      selection.value.dragging = false
      return
    }

    const sx = Math.min(startPoint.x, coords.x)
    const sy = Math.min(startPoint.y, coords.y)
    const sw = Math.abs(coords.x - startPoint.x)
    const sh = Math.abs(coords.y - startPoint.y)

    if (sw > 4 && sh > 4 && mainCtx.value) {
      const imgData = mainCtx.value.getImageData(sx, sy, sw, sh)
      mainCtx.value.fillStyle = secondaryColor.value
      mainCtx.value.fillRect(sx, sy, sw, sh)

      selection.value = {
        active: true,
        x: sx,
        y: sy,
        w: sw,
        h: sh,
        imageData: imgData,
        dragging: false,
        dragOffset: { x: 0, y: 0 },
      }
      renderSelectionOverlay()
      pushHistory()
      return
    }
  }

  // Commit Shape to Main Canvas
  if (['line', 'rect', 'round_rect', 'ellipse', 'curve'].includes(activeTool.value)) {
    if (mainCtx.value && overlayCtx.value && overlayCanvas.value) {
      drawShape(
        mainCtx.value,
        activeTool.value,
        startPoint.x,
        startPoint.y,
        coords.x,
        coords.y,
        currentColor,
        altColor,
      )
      overlayCtx.value.clearRect(0, 0, overlayCanvas.value.width, overlayCanvas.value.height)
      pushHistory()
    }
  } else if (['pencil', 'brush', 'eraser', 'airbrush'].includes(activeTool.value)) {
    pushHistory()
  }
}

// Render selection floating overlay with marquee handles
function renderSelectionOverlay() {
  if (!overlayCtx.value || !overlayCanvas.value || !selection.value.active) return
  const ctx = overlayCtx.value
  const s = selection.value

  ctx.clearRect(0, 0, overlayCanvas.value.width, overlayCanvas.value.height)

  if (s.imageData) {
    if (selectionTransparent.value) {
      const copy = new ImageData(
        new Uint8ClampedArray(s.imageData.data),
        s.imageData.width,
        s.imageData.height,
      )
      const secR = parseInt(secondaryColor.value.slice(1, 3), 16)
      const secG = parseInt(secondaryColor.value.slice(3, 5), 16)
      const secB = parseInt(secondaryColor.value.slice(5, 7), 16)
      for (let i = 0; i < copy.data.length; i += 4) {
        if (
          Math.abs(copy.data[i] - secR) < 18 &&
          Math.abs(copy.data[i + 1] - secG) < 18 &&
          Math.abs(copy.data[i + 2] - secB) < 18
        ) {
          copy.data[i + 3] = 0
        }
      }
      ctx.putImageData(copy, s.x, s.y)
    } else {
      ctx.putImageData(s.imageData, s.x, s.y)
    }
  }

  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])
  ctx.strokeRect(s.x, s.y, s.w, s.h)
  ctx.setLineDash([])

  const handles = [
    [s.x, s.y],
    [s.x + s.w / 2, s.y],
    [s.x + s.w, s.y],
    [s.x + s.w, s.y + s.h / 2],
    [s.x + s.w, s.y + s.h],
    [s.x + s.w / 2, s.y + s.h],
    [s.x, s.y + s.h],
    [s.x, s.y + s.h / 2],
  ]
  ctx.fillStyle = '#000080'
  handles.forEach(([hx, hy]) => {
    ctx.fillRect(hx - 2, hy - 2, 4, 4)
  })
}

function commitSelection() {
  if (!selection.value.active || !mainCtx.value || !overlayCtx.value || !overlayCanvas.value) return
  const s = selection.value

  if (s.imageData) {
    if (selectionTransparent.value) {
      const copy = new ImageData(
        new Uint8ClampedArray(s.imageData.data),
        s.imageData.width,
        s.imageData.height,
      )
      const secR = parseInt(secondaryColor.value.slice(1, 3), 16)
      const secG = parseInt(secondaryColor.value.slice(3, 5), 16)
      const secB = parseInt(secondaryColor.value.slice(5, 7), 16)
      for (let i = 0; i < copy.data.length; i += 4) {
        if (
          Math.abs(copy.data[i] - secR) < 18 &&
          Math.abs(copy.data[i + 1] - secG) < 18 &&
          Math.abs(copy.data[i + 2] - secB) < 18
        ) {
          copy.data[i + 3] = 0
        }
      }
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = s.w
      tempCanvas.height = s.h
      const tempCtx = tempCanvas.getContext('2d')!
      tempCtx.putImageData(copy, 0, 0)
      mainCtx.value.drawImage(tempCanvas, s.x, s.y)
    } else {
      mainCtx.value.putImageData(s.imageData, s.x, s.y)
    }
  }

  overlayCtx.value.clearRect(0, 0, overlayCanvas.value.width, overlayCanvas.value.height)
  selection.value.active = false
  selection.value.imageData = null
  pushHistory()
}

function deleteSelection() {
  if (!selection.value.active || !overlayCtx.value || !overlayCanvas.value) return
  overlayCtx.value.clearRect(0, 0, overlayCanvas.value.width, overlayCanvas.value.height)
  selection.value.active = false
  selection.value.imageData = null
  pushHistory()
}

// Text Commit
function commitText() {
  if (!textInput.value.visible || !mainCtx.value) return
  const txt = textInput.value.text.trim()
  if (txt) {
    mainCtx.value.fillStyle = primaryColor.value
    mainCtx.value.font = `${textInput.value.fontSize}px w95fa, "Courier New", monospace`
    mainCtx.value.fillText(txt, textInput.value.x, textInput.value.y + textInput.value.fontSize)
    pushHistory()
  }
  textInput.value.visible = false
  textInput.value.text = ''
}

// Menu Actions
function handleNew() {
  if (!mainCtx.value || !mainCanvas.value) return
  mainCtx.value.fillStyle = '#ffffff'
  mainCtx.value.fillRect(0, 0, mainCanvas.value.width, mainCanvas.value.height)
  pushHistory()
  activeMenu.value = null
}

function handleSave() {
  if (!mainCanvas.value) return
  const link = document.createElement('a')
  link.download = 'habilidades_skills.png'
  link.href = mainCanvas.value.toDataURL('image/png')
  link.click()
  activeMenu.value = null
}

function handleRestoreSkills() {
  drawInitialSkills()
  activeMenu.value = null
}

function handleInvert() {
  if (!mainCtx.value || !mainCanvas.value) return
  const imgData = mainCtx.value.getImageData(0, 0, mainCanvas.value.width, mainCanvas.value.height)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 255 - d[i]
    d[i + 1] = 255 - d[i + 1]
    d[i + 2] = 255 - d[i + 2]
  }
  mainCtx.value.putImageData(imgData, 0, 0)
  pushHistory()
  activeMenu.value = null
}

function handleClear() {
  if (!mainCtx.value || !mainCanvas.value) return
  mainCtx.value.fillStyle = secondaryColor.value
  mainCtx.value.fillRect(0, 0, mainCanvas.value.width, mainCanvas.value.height)
  pushHistory()
  activeMenu.value = null
}

function handleExit() {
  emit('close')
}

// Keyboard shortcuts
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    handleUndo()
  } else if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    handleRedo()
  } else if (e.key === 'Delete') {
    if (selection.value.active) {
      deleteSelection()
    }
  } else if (e.key === 'Escape') {
    activeMenu.value = null
    if (selection.value.active) {
      commitSelection()
    }
  }
}

// Close menus on outside click
function onWindowPointerDown(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.paint-menu')) {
    activeMenu.value = null
  }
}

onMounted(() => {
  nextTick(() => {
    if (viewportEl.value) {
      resizeObserver = new ResizeObserver(() => {
        updateCanvasSize()
      })
      resizeObserver.observe(viewportEl.value)
    }

    if (mainCanvas.value && overlayCanvas.value) {
      mainCtx.value = mainCanvas.value.getContext('2d', { willReadFrequently: true })
      overlayCtx.value = overlayCanvas.value.getContext('2d')
      updateCanvasSize()
    }
  })

  window.addEventListener('keydown', onKeyDown)
  document.addEventListener('pointerdown', onWindowPointerDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('pointerdown', onWindowPointerDown)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (sprayTimer !== null) clearInterval(sprayTimer)
})
</script>

<template>
  <div class="paint-app" @contextmenu.prevent>
    <!-- Menu Bar -->
    <header class="paint-menubar">
      <div class="paint-menus-group">
        <!-- File -->
        <div
          class="paint-menu"
          :class="{ 'paint-menu--open': activeMenu === 'file' }"
        >
          <button
            type="button"
            class="paint-menu__trigger"
            @click="activeMenu = activeMenu === 'file' ? null : 'file'"
          >
            <u>{{ messages.paint.menu.file[0] }}</u>{{ messages.paint.menu.file.slice(1) }}
          </button>
          <div v-if="activeMenu === 'file'" class="paint-dropdown">
            <button type="button" @click="handleNew">
              <span class="paint-menu-label">{{ messages.paint.menu.new }}</span>
              <span class="shortcut">Ctrl+N</span>
            </button>
            <button type="button" @click="handleRestoreSkills">
              <span class="paint-menu-label">{{ messages.paint.menu.restore }}</span>
            </button>
            <button type="button" @click="handleSave">
              <span class="paint-menu-label">{{ messages.paint.menu.save }}</span>
              <span class="shortcut">Ctrl+S</span>
            </button>
            <hr />
            <button type="button" @click="handleExit">
              <span class="paint-menu-label">{{ messages.paint.menu.exit }}</span>
            </button>
          </div>
        </div>

        <!-- Edit -->
        <div
          class="paint-menu"
          :class="{ 'paint-menu--open': activeMenu === 'edit' }"
        >
          <button
            type="button"
            class="paint-menu__trigger"
            @click="activeMenu = activeMenu === 'edit' ? null : 'edit'"
          >
            <u>{{ messages.paint.menu.edit[0] }}</u>{{ messages.paint.menu.edit.slice(1) }}
          </button>
          <div v-if="activeMenu === 'edit'" class="paint-dropdown">
            <button type="button" :disabled="undoStack.length <= 1" @click="handleUndo">
              <span class="paint-menu-label">{{ messages.paint.menu.undo }}</span>
              <span class="shortcut">Ctrl+Z</span>
            </button>
            <button type="button" :disabled="redoStack.length === 0" @click="handleRedo">
              <span class="paint-menu-label">{{ messages.paint.menu.redo }}</span>
              <span class="shortcut">Ctrl+Y</span>
            </button>
            <hr />
            <button type="button" @click="handleClear">
              <span class="paint-menu-label">{{ messages.paint.menu.clearImage }}</span>
            </button>
          </div>
        </div>

        <!-- View -->
        <div
          class="paint-menu"
          :class="{ 'paint-menu--open': activeMenu === 'view' }"
        >
          <button
            type="button"
            class="paint-menu__trigger"
            @click="activeMenu = activeMenu === 'view' ? null : 'view'"
          >
            <u>{{ messages.paint.menu.view[0] }}</u>{{ messages.paint.menu.view.slice(1) }}
          </button>
          <div v-if="activeMenu === 'view'" class="paint-dropdown">
            <button type="button" @click="zoomLevel = 1">
              <span class="paint-menu-label">{{ messages.paint.menu.normalSize }}</span>
            </button>
            <button type="button" @click="zoomLevel = 2">
              <span class="paint-menu-label">{{ messages.paint.menu.largeSize }}</span>
            </button>
            <button type="button" @click="zoomLevel = 4">
              <span class="paint-menu-label">{{ messages.paint.menu.extraLarge }}</span>
            </button>
          </div>
        </div>

        <!-- Image -->
        <div
          class="paint-menu"
          :class="{ 'paint-menu--open': activeMenu === 'image' }"
        >
          <button
            type="button"
            class="paint-menu__trigger"
            @click="activeMenu = activeMenu === 'image' ? null : 'image'"
          >
            <u>{{ messages.paint.menu.image[0] }}</u>{{ messages.paint.menu.image.slice(1) }}
          </button>
          <div v-if="activeMenu === 'image'" class="paint-dropdown">
            <button type="button" @click="handleInvert">
              <span class="paint-menu-label">{{ messages.paint.menu.invertColors }}</span>
              <span class="shortcut">Ctrl+I</span>
            </button>
            <button type="button" @click="handleClear">
              <span class="paint-menu-label">{{ messages.paint.menu.clearImage }}</span>
            </button>
          </div>
        </div>

        <!-- Colors -->
        <div
          class="paint-menu"
          :class="{ 'paint-menu--open': activeMenu === 'colors' }"
        >
          <button
            type="button"
            class="paint-menu__trigger"
            @click="activeMenu = activeMenu === 'colors' ? null : 'colors'"
          >
            <u>{{ messages.paint.menu.colors[0] }}</u>{{ messages.paint.menu.colors.slice(1) }}
          </button>
          <div v-if="activeMenu === 'colors'" class="paint-dropdown">
            <button type="button" @click="primaryColor = '#000000'; secondaryColor = '#ffffff'; activeMenu = null">
              <span class="paint-menu-label">{{ messages.paint.menu.resetPalette }}</span>
            </button>
          </div>
        </div>

        <!-- Help -->
        <div
          class="paint-menu"
          :class="{ 'paint-menu--open': activeMenu === 'help' }"
        >
          <button
            type="button"
            class="paint-menu__trigger"
            @click="activeMenu = activeMenu === 'help' ? null : 'help'"
          >
            <u>{{ messages.paint.menu.help[0] }}</u>{{ messages.paint.menu.help.slice(1) }}
          </button>
          <div v-if="activeMenu === 'help'" class="paint-dropdown">
            <button type="button" @click="showAboutModal = true; activeMenu = null">
              <span class="paint-menu-label">{{ messages.paint.menu.aboutPaint }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Workspace (Toolbar + Canvas) -->
    <div class="paint-workspace">
      <!-- Left Toolbar: 16 Tools & Modifier Options -->
      <aside class="paint-toolbox">
        <div class="paint-tools-grid">
          <!-- Row 1: Free-form select & Select -->
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'star_select' }"
            :title="messages.paint.tools.star_select.name"
            @click="selectTool('star_select')"
            @mouseenter="hoveredTool = 'star_select'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="none" stroke="#000" stroke-width="1.3" stroke-dasharray="2,2"/>
            </svg>
          </button>
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'rect_select' }"
            :title="messages.paint.tools.rect_select.name"
            @click="selectTool('rect_select')"
            @mouseenter="hoveredTool = 'rect_select'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <rect x="3" y="4" width="18" height="16" fill="none" stroke="#000" stroke-width="1.3" stroke-dasharray="2.5,2"/>
            </svg>
          </button>

          <!-- Row 2: Eraser & Fill Bucket -->
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'eraser' }"
            :title="messages.paint.tools.eraser.name"
            @click="selectTool('eraser')"
            @mouseenter="hoveredTool = 'eraser'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <g transform="rotate(-30 12 12)">
                <rect x="5" y="7" width="14" height="10" rx="1" fill="#fca5a5" stroke="#000" stroke-width="1.2"/>
                <rect x="5" y="11" width="14" height="6" fill="#93c5fd" stroke="#000" stroke-width="1.2"/>
                <line x1="5" y1="11" x2="19" y2="11" stroke="#000" stroke-width="1.2"/>
              </g>
            </svg>
          </button>
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'bucket' }"
            :title="messages.paint.tools.bucket.name"
            @click="selectTool('bucket')"
            @mouseenter="hoveredTool = 'bucket'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <path d="M7 6 L15 3 L19 11 L11 14 Z" fill="#94a3b8" stroke="#000" stroke-width="1.2"/>
              <path d="M11 14 L19 11 L16 17 L8 18 Z" fill="#3b82f6" stroke="#000" stroke-width="1.2"/>
              <path d="M6 16 Q4 21 6 22 Q9 22 10 18 Q12 16 9 16 Z" fill="#2563eb"/>
              <circle cx="5" cy="18" r="1.5" fill="#2563eb"/>
            </svg>
          </button>

          <!-- Row 3: Eyedropper & Magnifier -->
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'picker' }"
            :title="messages.paint.tools.picker.name"
            @click="selectTool('picker')"
            @mouseenter="hoveredTool = 'picker'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <path d="M15 3 L20 8 L18 10 L13 5 Z" fill="#1e293b"/>
              <path d="M13 5 L18 10 L10 18 L6 18 L6 14 Z" fill="#e2e8f0" stroke="#000" stroke-width="1.2"/>
              <path d="M6 18 L3 21 L5 21 L7 19 Z" fill="#000"/>
              <circle cx="3" cy="22" r="1.2" fill="#3b82f6"/>
            </svg>
          </button>
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'magnifier' }"
            :title="messages.paint.tools.magnifier.name"
            @click="selectTool('magnifier')"
            @mouseenter="hoveredTool = 'magnifier'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <circle cx="10" cy="10" r="6.5" fill="#e0f2fe" stroke="#000" stroke-width="1.8"/>
              <path d="M7 7 A4 4 0 0 1 11 6" fill="none" stroke="#fff" stroke-width="1.5"/>
              <line x1="15" y1="15" x2="21" y2="21" stroke="#000" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- Row 4: Pencil & Brush -->
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'pencil' }"
            :title="messages.paint.tools.pencil.name"
            @click="selectTool('pencil')"
            @mouseenter="hoveredTool = 'pencil'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <g transform="rotate(-45 12 12)">
                <rect x="5" y="9" width="10" height="6" fill="#eab308" stroke="#000" stroke-width="1.2"/>
                <rect x="15" y="9" width="4" height="6" fill="#f472b6" stroke="#000" stroke-width="1.2"/>
                <polygon points="5,9 5,15 1,12" fill="#fed7aa" stroke="#000" stroke-width="1.2"/>
                <polygon points="2.5,10.5 2.5,13.5 1,12" fill="#000"/>
              </g>
            </svg>
          </button>
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'brush' }"
            :title="messages.paint.tools.brush.name"
            @click="selectTool('brush')"
            @mouseenter="hoveredTool = 'brush'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <g transform="rotate(-45 12 12)">
                <path d="M12 10 L22 10 L22 14 L12 14 Z" fill="#b45309" stroke="#000" stroke-width="1"/>
                <rect x="8" y="9.5" width="4" height="5" fill="#94a3b8" stroke="#000" stroke-width="1"/>
                <path d="M8 10 Q3 9 2 12 Q3 15 8 14 Z" fill="#1e293b"/>
              </g>
            </svg>
          </button>

          <!-- Row 5: Airbrush & Text -->
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'airbrush' }"
            :title="messages.paint.tools.airbrush.name"
            @click="selectTool('airbrush')"
            @mouseenter="hoveredTool = 'airbrush'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <g transform="rotate(-25 12 12)">
                <rect x="8" y="10" width="8" height="11" rx="1" fill="#3b82f6" stroke="#000" stroke-width="1.2"/>
                <rect x="10" y="6" width="4" height="4" fill="#64748b" stroke="#000" stroke-width="1.2"/>
                <line x1="9" y1="6" x2="15" y2="6" stroke="#000" stroke-width="1.5"/>
              </g>
              <circle cx="5" cy="5" r="0.9" fill="#3b82f6"/>
              <circle cx="8" cy="3" r="1.1" fill="#3b82f6"/>
              <circle cx="4" cy="9" r="0.9" fill="#3b82f6"/>
              <circle cx="7" cy="7" r="1.2" fill="#2563eb"/>
            </svg>
          </button>
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'text' }"
            :title="messages.paint.tools.text.name"
            @click="selectTool('text')"
            @mouseenter="hoveredTool = 'text'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <text x="12" y="18" font-family="'Times New Roman', serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">A</text>
            </svg>
          </button>

          <!-- Row 6: Line & Curve -->
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'line' }"
            :title="messages.paint.tools.line.name"
            @click="selectTool('line')"
            @mouseenter="hoveredTool = 'line'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <line x1="3" y1="21" x2="21" y2="3" stroke="#000" stroke-width="2"/>
            </svg>
          </button>
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'curve' }"
            :title="messages.paint.tools.curve.name"
            @click="selectTool('curve')"
            @mouseenter="hoveredTool = 'curve'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <path d="M3,19 Q7,4 12,12 T21,5" fill="none" stroke="#000" stroke-width="2"/>
            </svg>
          </button>

          <!-- Row 7: Rectangle & Polygon -->
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'rect' }"
            :title="messages.paint.tools.rect.name"
            @click="selectTool('rect')"
            @mouseenter="hoveredTool = 'rect'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <rect x="3" y="5" width="18" height="14" fill="none" stroke="#000" stroke-width="1.8"/>
            </svg>
          </button>
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'polygon' }"
            :title="messages.paint.tools.polygon.name"
            @click="selectTool('polygon')"
            @mouseenter="hoveredTool = 'polygon'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <polygon points="4,18 9,5 20,7 18,18 10,21" fill="none" stroke="#000" stroke-width="1.8"/>
            </svg>
          </button>

          <!-- Row 8: Ellipse & Rounded Rectangle -->
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'ellipse' }"
            :title="messages.paint.tools.ellipse.name"
            @click="selectTool('ellipse')"
            @mouseenter="hoveredTool = 'ellipse'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <ellipse cx="12" cy="12" rx="10" ry="7" fill="none" stroke="#000" stroke-width="1.8"/>
            </svg>
          </button>
          <button
            type="button"
            class="tool-btn"
            :class="{ 'tool-btn--active': activeTool === 'round_rect' }"
            :title="messages.paint.tools.round_rect.name"
            @click="selectTool('round_rect')"
            @mouseenter="hoveredTool = 'round_rect'"
            @mouseleave="hoveredTool = null"
          >
            <svg viewBox="0 0 24 24" class="tool-icon">
              <rect x="3" y="5" width="18" height="14" rx="4" ry="4" fill="none" stroke="#000" stroke-width="1.8"/>
            </svg>
          </button>
        </div>

        <!-- Tool Modifier Options Panel -->
        <div class="paint-options-box">
          <!-- Selection Options -->
          <template v-if="activeTool === 'rect_select' || activeTool === 'star_select'">
            <div
              class="option-mode-btn"
              :class="{ 'option-mode-btn--active': !selectionTransparent }"
              title="Opaco"
              @click="selectionTransparent = false"
            >
              <div class="selection-card selection-card--opaque">
                <div class="shapes-bg">
                  <span class="shape-cylinder" />
                  <span class="shape-sphere" />
                </div>
                <div class="card-front card-front--opaque">
                  <span class="shape-cube" />
                </div>
              </div>
            </div>
            <div
              class="option-mode-btn"
              :class="{ 'option-mode-btn--active': selectionTransparent }"
              title="Transparente"
              @click="selectionTransparent = true"
            >
              <div class="selection-card selection-card--transparent">
                <div class="shapes-bg">
                  <span class="shape-cylinder" />
                  <span class="shape-sphere" />
                </div>
                <div class="card-front card-front--transparent">
                  <span class="shape-cube" />
                </div>
              </div>
            </div>
          </template>

          <!-- Eraser Sizes -->
          <template v-else-if="activeTool === 'eraser'">
            <div class="eraser-options">
              <button
                v-for="s in [4, 6, 8, 12]"
                :key="s"
                type="button"
                class="eraser-size-btn"
                :class="{ 'eraser-size-btn--active': eraserSize === s }"
                @click="eraserSize = s"
              >
                <span class="eraser-preview" :style="{ width: `${s}px`, height: `${s}px` }" />
              </button>
            </div>
          </template>

          <!-- Brush Shapes/Sizes -->
          <template v-else-if="activeTool === 'brush'">
            <div class="brush-options">
              <button
                v-for="s in [2, 5, 8]"
                :key="s"
                type="button"
                class="brush-size-btn"
                :class="{ 'brush-size-btn--active': brushSize === s }"
                @click="brushSize = s"
              >
                <span class="brush-dot" :style="{ width: `${s}px`, height: `${s}px` }" />
              </button>
            </div>
          </template>

          <!-- Line Widths -->
          <template v-else-if="activeTool === 'line' || activeTool === 'curve'">
            <div class="line-options">
              <button
                v-for="w in [1, 2, 3, 4, 5]"
                :key="w"
                type="button"
                class="line-width-btn"
                :class="{ 'line-width-btn--active': lineWidth === w }"
                @click="lineWidth = w"
              >
                <span class="line-bar" :style="{ height: `${w}px` }" />
              </button>
            </div>
          </template>

          <!-- Shape Fill Modes -->
          <template v-else-if="['rect', 'round_rect', 'ellipse', 'polygon'].includes(activeTool)">
            <div class="shape-options">
              <button
                type="button"
                class="shape-mode-btn"
                :class="{ 'shape-mode-btn--active': shapeMode === 'stroke' }"
                @click="shapeMode = 'stroke'"
              >
                <span class="shape-mode-rect shape-mode-rect--stroke" />
              </button>
              <button
                type="button"
                class="shape-mode-btn"
                :class="{ 'shape-mode-btn--active': shapeMode === 'stroke_fill' }"
                @click="shapeMode = 'stroke_fill'"
              >
                <span class="shape-mode-rect shape-mode-rect--stroke-fill" />
              </button>
              <button
                type="button"
                class="shape-mode-btn"
                :class="{ 'shape-mode-btn--active': shapeMode === 'fill' }"
                @click="shapeMode = 'fill'"
              >
                <span class="shape-mode-rect shape-mode-rect--fill" />
              </button>
            </div>
          </template>

          <!-- Airbrush Spray Sizes -->
          <template v-else-if="activeTool === 'airbrush'">
            <div class="airbrush-options">
              <button
                v-for="r in [8, 12, 18]"
                :key="r"
                type="button"
                class="airbrush-size-btn"
                :class="{ 'airbrush-size-btn--active': airbrushRadius === r }"
                @click="airbrushRadius = r"
              >
                <span class="spray-circle" :style="{ width: `${r}px`, height: `${r}px` }" />
              </button>
            </div>
          </template>

          <!-- Default fallback -->
          <template v-else>
            <div class="default-options-placeholder">
              <span class="classic-logo">Paint</span>
            </div>
          </template>
        </div>
      </aside>

      <!-- Center Drawing Area: White Canvas dynamically matching screen/viewport -->
      <div ref="viewportEl" class="paint-canvas-viewport">
        <div class="canvas-wrapper" :style="{ transform: `scale(${zoomLevel})` }">
          <canvas
            ref="mainCanvas"
            :width="canvasWidth"
            :height="canvasHeight"
            class="drawing-canvas drawing-canvas--main"
          />
          <canvas
            ref="overlayCanvas"
            :width="canvasWidth"
            :height="canvasHeight"
            class="drawing-canvas drawing-canvas--overlay"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointerleave="onPointerUp"
          />

          <!-- In-place text tool overlay -->
          <div
            v-if="textInput.visible"
            class="text-tool-overlay"
            :style="{ left: `${textInput.x}px`, top: `${textInput.y}px` }"
          >
            <input
              ref="textInputEl"
              v-model="textInput.text"
              type="text"
              class="text-tool-input"
              :style="{ color: primaryColor }"
              @keydown.enter="commitText"
              @keydown.esc="textInput.visible = false"
              @blur="commitText"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Palette Bar: Dual Color Box + 28 Color Swatches -->
    <footer class="paint-palette-bar">
      <!-- Active Color Indicator Box (Foreground overlapping Background) -->
      <div class="active-colors-box" title="Color 1 / Color 2">
        <div
          class="color-square color-square--secondary"
          :style="{ backgroundColor: secondaryColor }"
        />
        <div
          class="color-square color-square--primary"
          :style="{ backgroundColor: primaryColor }"
        />
      </div>

      <!-- 28 Classic Swatches (2 rows of 14) -->
      <div class="palette-swatches-grid">
        <button
          v-for="color in paletteColors"
          :key="color"
          type="button"
          class="swatch-btn"
          :style="{ backgroundColor: color }"
          :title="color"
          @click.left="setPrimary(color)"
          @contextmenu.prevent="setSecondary(color)"
        />
      </div>
    </footer>

    <!-- Bottom Status Bar -->
    <div class="paint-statusbar">
      <div class="status-panel status-panel--message">
        {{ currentStatus }}
      </div>
      <div class="status-panel status-panel--coords">
        <span v-if="mouseCoords">{{ mouseCoords.x }}, {{ mouseCoords.y }} px</span>
      </div>
      <div class="status-panel status-panel--dims">
        <span v-if="shapeBox">{{ shapeBox.w }}x{{ shapeBox.h }}</span>
      </div>
    </div>

    <!-- About Modal (Retro Win95 Dialog) -->
    <div v-if="showAboutModal" class="about-modal-backdrop" @click="showAboutModal = false">
      <div class="about-dialog" @click.stop>
        <div class="about-dialog__titlebar">
          <span>{{ messages.paint.aboutDialog.title }}</span>
          <button type="button" @click="showAboutModal = false">×</button>
        </div>
        <div class="about-dialog__body">
          <div class="about-dialog__header">
            <span class="about-icon">🎨</span>
            <div>
              <h3>{{ messages.paint.aboutDialog.heading }}</h3>
              <p>{{ messages.paint.aboutDialog.subheading }}</p>
            </div>
          </div>
          <hr />
          <div class="about-dialog__content">
            <p><strong>{{ messages.paint.aboutDialog.specialty }}</strong></p>
            <p>{{ messages.paint.aboutDialog.skillsTitle }}</p>
          </div>
          <div class="about-dialog__footer">
            <button type="button" class="retro-dlg-btn" @click="showAboutModal = false">{{ messages.paint.aboutDialog.ok }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.paint-app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #c0c0c0;
  color: #000;
  font-family: 'Tahoma', 'w95fa', sans-serif;
  font-size: 11px;
  user-select: none;
  overflow: hidden;
  box-sizing: border-box;
}

/* Menu Bar */
.paint-menubar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 1px 4px;
  background: #c0c0c0;
  border-bottom: 1px solid #d4d0c8;
  flex-shrink: 0;
}

.paint-menus-group {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
}

.paint-menu {
  position: relative;
}

.paint-menu__trigger {
  padding: 2px 6px;
  background: transparent;
  border: 1px solid transparent;
  font: inherit;
  color: #000;
  cursor: pointer;
  line-height: 14px;
}

.paint-menu__trigger:hover,
.paint-menu--open .paint-menu__trigger {
  border: 1px solid #000080;
  background: #316ac5;
  color: #ffffff;
}

.paint-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
  z-index: 1000;
  padding: 2px;
  display: flex;
  flex-direction: column;
}

.paint-dropdown button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 3px 8px;
  background: transparent;
  border: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
  color: #000;
  white-space: nowrap;
}

.paint-menu-label {
  display: inline-flex;
  align-items: baseline;
  text-align: left;
}

.paint-dropdown button:hover:not(:disabled) {
  background: #316ac5;
  color: #fff;
}

.paint-dropdown button:disabled {
  color: #808080;
  cursor: default;
}

.paint-dropdown hr {
  margin: 2px 0;
  border: 0;
  border-top: 1px solid #808080;
  border-bottom: 1px solid #fff;
}

.paint-dropdown .shortcut {
  font-size: 10px;
  opacity: 0.8;
  margin-left: 16px;
}

/* Workspace */
.paint-workspace {
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  background: #c0c0c0;
  overflow: hidden;
}

/* Toolbox */
.paint-toolbox {
  width: 56px;
  flex-shrink: 0;
  padding: 3px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: #c0c0c0;
  border-right: 1px solid #d4d0c8;
}

.paint-tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 25px);
  gap: 0;
}

.tool-btn {
  width: 25px;
  height: 24px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c0c0c0;
  border: 1px solid transparent;
  cursor: pointer;
  box-sizing: border-box;
}

.tool-btn:hover {
  border: 1px solid;
  border-color: #fff #808080 #808080 #fff;
}

.tool-btn--active {
  background: #ffffff !important;
  border: 1px solid !important;
  border-color: #808080 #fff #fff #808080 !important;
  box-shadow: inset 1px 1px 0 #000000;
}

.tool-icon {
  width: 18px;
  height: 18px;
  display: block;
}

/* Options Box */
.paint-options-box {
  width: 46px;
  min-height: 60px;
  box-sizing: border-box;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

/* Selection Mode Cards */
.option-mode-btn {
  width: 40px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  cursor: pointer;
  box-sizing: border-box;
}

.option-mode-btn--active {
  background: #000080;
  border-color: #000080;
}

.selection-card {
  width: 34px;
  height: 22px;
  background: #ffffc0;
  border: 1px solid #000;
  position: relative;
  overflow: hidden;
}

.shapes-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 3px;
  gap: 2px;
}

.shape-cylinder {
  width: 6px;
  height: 14px;
  background: #1e3a8a;
  border-radius: 2px;
  display: inline-block;
}

.shape-sphere {
  width: 8px;
  height: 8px;
  background: #b91c1c;
  border-radius: 50%;
  display: inline-block;
}

.card-front {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-front--opaque {
  background: #ffffff;
  border: 1px solid #000;
}

.card-front--transparent {
  background: transparent;
  border: 1px dashed #000;
}

.shape-cube {
  width: 8px;
  height: 8px;
  background: #16a34a;
  display: inline-block;
}

/* Sub-options for tools */
.eraser-options,
.brush-options,
.line-options,
.shape-options,
.airbrush-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 100%;
}

.eraser-size-btn,
.brush-size-btn,
.line-width-btn,
.shape-mode-btn,
.airbrush-size-btn {
  width: 38px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
}

.eraser-size-btn--active,
.brush-size-btn--active,
.line-width-btn--active,
.shape-mode-btn--active,
.airbrush-size-btn--active {
  background: #000080;
}

.eraser-preview {
  background: #000;
  display: block;
}
.eraser-size-btn--active .eraser-preview,
.brush-size-btn--active .brush-dot,
.line-width-btn--active .line-bar {
  background: #fff;
}

.brush-dot {
  background: #000;
  border-radius: 50%;
  display: block;
}

.line-bar {
  width: 28px;
  background: #000;
  display: block;
}

.shape-mode-rect {
  width: 24px;
  height: 10px;
  display: block;
}
.shape-mode-rect--stroke {
  border: 1px solid #000;
  background: transparent;
}
.shape-mode-rect--stroke-fill {
  border: 1px solid #000;
  background: #808080;
}
.shape-mode-rect--fill {
  background: #808080;
}
.shape-mode-btn--active .shape-mode-rect--stroke {
  border-color: #fff;
}
.shape-mode-btn--active .shape-mode-rect--stroke-fill {
  border-color: #fff;
  background: #fff;
}
.shape-mode-btn--active .shape-mode-rect--fill {
  background: #fff;
}

.spray-circle {
  border: 1px dashed #000;
  border-radius: 50%;
  display: block;
}
.airbrush-size-btn--active .spray-circle {
  border-color: #fff;
}

.default-options-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.classic-logo {
  font-family: 'Times New Roman', serif;
  font-weight: bold;
  font-size: 13px;
  color: #808080;
}

/* Canvas Viewport */
.paint-canvas-viewport {
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: #808080;
  padding: 4px;
  overflow: auto;
  position: relative;
  box-sizing: border-box;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  box-shadow: inset 1px 1px 0 #404040;
  -webkit-overflow-scrolling: touch;
}

/* Custom WinXP-style scrollbars */
.paint-canvas-viewport::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}
.paint-canvas-viewport::-webkit-scrollbar-track {
  background: #c0c0c0;
  border: 1px solid #808080;
}
.paint-canvas-viewport::-webkit-scrollbar-thumb {
  background: #c8d8f8;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: inset 1px 1px #fff;
}

.canvas-wrapper {
  position: relative;
  display: inline-block;
  transform-origin: 0 0;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
}

.drawing-canvas {
  display: block;
  image-rendering: pixelated;
  touch-action: none;
}

.drawing-canvas--main {
  background: #ffffff;
}

.drawing-canvas--overlay {
  position: absolute;
  top: 0;
  left: 0;
  cursor: crosshair;
}

.text-tool-overlay {
  position: absolute;
  z-index: 10;
}

.text-tool-input {
  background: transparent;
  border: 1px dashed #000;
  font-family: w95fa, 'Courier New', monospace;
  font-size: 16px;
  outline: none;
  padding: 0 2px;
}

/* Bottom Palette Bar */
.paint-palette-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 6px;
  background: #c0c0c0;
  border-top: 1px solid #d4d0c8;
  flex-shrink: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.active-colors-box {
  width: 32px;
  height: 32px;
  position: relative;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  flex-shrink: 0;
}

.color-square {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid #000;
  box-sizing: border-box;
}

.color-square--secondary {
  bottom: 2px;
  right: 2px;
}

.color-square--primary {
  top: 2px;
  left: 2px;
  z-index: 1;
}

.palette-swatches-grid {
  display: grid;
  grid-template-rows: repeat(2, 14px);
  grid-auto-flow: column;
  gap: 1px;
}

.swatch-btn {
  width: 14px;
  height: 14px;
  padding: 0;
  margin: 0;
  border: 1px solid;
  border-color: #808080 #fff #fff #808080;
  cursor: pointer;
  box-sizing: border-box;
}

.swatch-btn:active {
  border-color: #000;
}

/* Status Bar */
.paint-statusbar {
  display: flex;
  height: 22px;
  background: #c0c0c0;
  border-top: 1px solid #d4d0c8;
  padding: 2px;
  gap: 2px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.status-panel {
  display: flex;
  align-items: center;
  padding: 0 4px;
  background: #c0c0c0;
  border: 1px solid;
  border-color: #808080 #fff #fff #808080;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 11px;
}

.status-panel--message {
  flex: 1;
}

.status-panel--coords {
  width: 80px;
  justify-content: center;
}

.status-panel--dims {
  width: 80px;
  justify-content: center;
}

/* About Dialog */
.about-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-dialog {
  width: 360px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  box-shadow: 2px 2px 0 #000;
  display: flex;
  flex-direction: column;
}

.about-dialog__titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
  background: #000080;
  color: #fff;
  font-weight: bold;
}

.about-dialog__titlebar button {
  width: 18px;
  height: 18px;
  background: #c0c0c0;
  border: 1px solid;
  border-color: #fff #404040 #404040 #fff;
  font-weight: bold;
  cursor: pointer;
  line-height: 12px;
  padding: 0;
}

.about-dialog__body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.about-dialog__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.about-icon {
  font-size: 32px;
}

.about-dialog__header h3 {
  margin: 0;
  font-size: 14px;
  color: #000080;
}

.about-dialog__header p {
  margin: 2px 0 0;
  font-size: 11px;
}

.about-dialog__content p {
  margin: 4px 0;
  line-height: 1.4;
}


.about-dialog__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.retro-dlg-btn {
  padding: 4px 16px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  font: inherit;
  font-weight: bold;
  cursor: pointer;
}

.retro-dlg-btn:active {
  border-color: #404040 #fff #fff #404040;
}

/* Responsive Media Queries */
@media (max-width: 600px) {
  .paint-menubar {
    padding: 1px 2px;
  }

  .paint-menu__trigger {
    padding: 2px 4px;
    font-size: 10px;
  }

  .paint-toolbox {
    width: 50px;
    padding: 2px 1px;
  }

  .paint-tools-grid {
    grid-template-columns: repeat(2, 23px);
  }

  .tool-btn {
    width: 23px;
    height: 22px;
  }

  .tool-icon {
    width: 16px;
    height: 16px;
  }

  .paint-options-box {
    width: 44px;
  }

  .status-panel--coords,
  .status-panel--dims {
    display: none;
  }
}
</style>
