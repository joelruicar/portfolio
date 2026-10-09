<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

const emit = defineEmits<{
  close: []
}>()

type Line = { text: string; kind: 'out' | 'in' }

const PROMPT = 'C:\\>'

const output = ref<Line[]>([
  { kind: 'out', text: 'Microsoft(R) Windows 95' },
  { kind: 'out', text: '   (C)Copyright Microsoft Corp 1981-1995.' },
  { kind: 'out', text: '' },
])

const input = ref('')
const inputEl = ref<HTMLInputElement | null>(null)
const scroller = ref<HTMLElement | null>(null)

const projectTree = [
  'portfolio-1',
  '├── public/',
  '│   ├── favicon.svg',
  '│   └── icons.svg',
  '├── src/',
  '│   ├── assets/',
  '│   ├── components/',
  '│   │   ├── desktop/',
  '│   │   ├── minesweeper/',
  '│   │   ├── windows/',
  '│   │   ├── Loading.vue',
  '│   │   ├── StartMenu.vue',
  '│   │   └── Taskbar.vue',
  '│   ├── stores/',
  '│   │   └── windows.ts',
  '│   ├── App.vue',
  '│   ├── i18n.ts',
  '│   └── main.ts',
  '├── index.html',
  '├── package.json',
  '├── tsconfig.json',
  '└── vite.config.ts',
]

const commands: Record<string, (args: string[]) => string[]> = {
  help: () => ['Comandos disponibles: HELP, ECHO, DIR, TREE, CLS, VER, EXIT'],
  ver: () => ['Windows 95 [Versión 4.00.950]'],
  echo: (args) => [args.join(' ')],
  dir: () => ['El volumen de la unidad C no tiene etiqueta.', ' Directorio de C:\\'],
  tree: () => projectTree,
  cls: () => {
    output.value = []
    return []
  },
  exit: () => {
    emit('close')
    return []
  },
}

function scrollToBottom() {
  nextTick(() => {
    if (scroller.value) {
      scroller.value.scrollTop = scroller.value.scrollHeight
    }
  })
}

function run(raw: string) {
  output.value.push({ kind: 'in', text: `${PROMPT}${raw}` })

  const [cmd = '', ...args] = raw.trim().split(/\s+/)
  if (!cmd) return

  const handler = commands[cmd.toLowerCase()]
  const result = handler
    ? handler(args)
    : [`Nombre de comando incorrecto o archivo no encontrado: ${cmd}`]

  result.forEach((text) => output.value.push({ kind: 'out', text }))
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Enter') return
  run(input.value)
  input.value = ''
  scrollToBottom()
}

function focusInput() {
  inputEl.value?.focus()
}

onMounted(focusInput)
</script>

<template>
  <div class="terminal" @click="focusInput">
    <div ref="scroller" class="screen">
      <div
        v-for="(line, i) in output"
        :key="i"
        class="line"
      >{{ line.text }}</div>

      <div class="line prompt-line">
        <span>{{ PROMPT }}</span>
        <input
          ref="inputEl"
          v-model="input"
          class="cmd"
          spellcheck="false"
          autocomplete="off"
          @keydown="onKeydown"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #000;
  color: #c0c0c0;
  font-family: 'Courier New', monospace;
  font-size: 15px;
  line-height: 1.2;
  padding: 8px;
  box-sizing: border-box;
  overflow: hidden;
  cursor: text;
}

.screen {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Scrollbar al estilo Win95 (WebKit/Blink) */
.screen::-webkit-scrollbar {
  width: 16px;
}

.screen::-webkit-scrollbar-track {
  background: #c0c0c0;
}

.screen::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf;
}

.line {
  min-height: 1.2em;
}

.prompt-line {
  display: flex;
  flex-shrink: 0;
}

.cmd {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font: inherit;
  padding: 0;
  caret-color: #c0c0c0;
}

.frame-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>