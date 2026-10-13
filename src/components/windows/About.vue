<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from '../../i18n'
import wordpadIcon from '../../assets/wordpad.ico'

const emit = defineEmits<{
  close: []
}>()

const { messages, locale } = useI18n()

// Document text & state
const bioText = ref(messages.value.notepad.defaultBio)
const isDirty = ref(false)
const textareaEl = ref<HTMLTextAreaElement | null>(null)
const formattedViewEl = ref<HTMLDivElement | null>(null)
const fileInputEl = ref<HTMLInputElement | null>(null)

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Case 2: Formatted bio with colored titles and functional clickable links
const formattedBioHtml = computed(() => {
  const lines = messages.value.notepad.defaultBio.split('\n')
  let headerBorderCount = 0
  let inHeader = false
  const output: string[] = []

  function processLine(rawLine: string): string {
    let escaped = escapeHtml(rawLine)
    if (escaped.trim().startsWith('•')) {
      escaped = escaped.replace(
        /(•\s*)([^:]+:)/,
        '<span class="bio-bullet">$1</span><span class="bio-key">$2</span>'
      )
    }
    escaped = escaped.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="bio-link">$1</a>'
    )
    if (/^(Nota|Note|Hinweis):/.test(rawLine.trim())) {
      escaped = `<span class="bio-note">${escaped}</span>`
    }
    return escaped
  }

  lines.forEach((line) => {
    const escaped = escapeHtml(line)

    // Border separators
    if (/^[=\-]{10,}$/.test(line.trim())) {
      if (line.includes('=')) {
        headerBorderCount++
      }
      inHeader = headerBorderCount === 1
      output.push(`<span class="bio-separator">${escaped}</span>`)
      return
    }

    // Top Header Block
    if (inHeader) {
      if (line.includes('JOEL RUIZ')) {
        output.push(`<span class="bio-main-title">${escaped}</span>`)
        return
      }
      if (line.trim().length > 0) {
        output.push(`<span class="bio-subtitle">${escaped}</span>`)
        return
      }
    }

    // Section Titles
    if (/^\[.+\]$/.test(line.trim())) {
      if (/^\[(PERFIL|PROFILE|PROFIL)\]$/i.test(line.trim())) {
        output.push(
          `<span class="bio-section-title">${escaped}</span><div class="bio-profile-photo-card"><img src="/me.jpeg" alt="Joel Ruiz" class="bio-profile-photo" /></div>`
        )
        return
      }
      output.push(`<span class="bio-section-title">${escaped}</span>`)
      return
    }

    output.push(processLine(line))
  })

  return output.join('\n')
})

// Display options
const wordWrap = ref(true)
const currentFont = ref<'courier' | 'lucida' | 'fixedsys' | 'sans'>('courier')
const currentFontSize = ref<number>(13)

// Menus state
type NotepadMenuKey = 'file' | 'edit' | 'search' | 'help'
const activeMenu = ref<NotepadMenuKey | null>(null)

// Dialogs state
const showAboutDialog = ref(false)
const showFindDialog = ref(false)
const showFontDialog = ref(false)
const showHelpDialog = ref(false)

// Find Dialog state
const searchQuery = ref('')
const searchMatchCase = ref(false)
const searchDirection = ref<'up' | 'down'>('down')
const searchNotFoundMsg = ref(false)

// Font Dialog temporary state
const tempFont = ref<'courier' | 'lucida' | 'fixedsys' | 'sans'>('courier')
const tempFontSize = ref<number>(13)

// Keep text in sync with locale if not edited manually
watch(locale, () => {
  if (!isDirty.value) {
    bioText.value = messages.value.notepad.defaultBio
  }
})

function onTextChange() {
  isDirty.value = true
}

// -------------------------------------------------------------
// Menu interactions
// -------------------------------------------------------------
function toggleMenu(menu: NotepadMenuKey) {
  activeMenu.value = activeMenu.value === menu ? null : menu
}

function onMenuHover(menu: NotepadMenuKey) {
  if (activeMenu.value !== null) {
    activeMenu.value = menu
  }
}

function closeAllMenus() {
  activeMenu.value = null
}

function onWindowPointerDown(e: PointerEvent) {
  const target = e.target as HTMLElement | null
  if (!target?.closest('.notepad-menu')) {
    closeAllMenus()
  }
}

// -------------------------------------------------------------
// File Menu Actions
// -------------------------------------------------------------
function handleNew() {
  closeAllMenus()
  bioText.value = ''
  isDirty.value = true
  nextTick(() => {
    textareaEl.value?.focus()
  })
}

function handleRestoreBio() {
  closeAllMenus()
  bioText.value = messages.value.notepad.defaultBio
  isDirty.value = false
  nextTick(() => {
    formattedViewEl.value?.focus()
  })
}

function handleOpenFilePicker() {
  closeAllMenus()
  fileInputEl.value?.click()
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    bioText.value = (e.target?.result as string) || ''
    isDirty.value = true
    nextTick(() => {
      textareaEl.value?.focus()
    })
  }
  reader.readAsText(file)
  input.value = ''
}

function handleSaveFile() {
  closeAllMenus()
  const content = isDirty.value ? bioText.value : messages.value.notepad.defaultBio
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = isDirty.value ? 'DOCUMENT.TXT' : 'ABOUT_ME.TXT'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function handlePrint() {
  closeAllMenus()
  window.print()
}

function handleExit() {
  closeAllMenus()
  emit('close')
}

// -------------------------------------------------------------
// Edit Menu Actions
// -------------------------------------------------------------
function handleUndo() {
  closeAllMenus()
  if (isDirty.value) {
    document.execCommand('undo')
  }
}

function handleCut() {
  closeAllMenus()
  if (!isDirty.value) {
    handleCopy()
    return
  }
  const el = textareaEl.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  if (start !== end) {
    const selected = el.value.substring(start, end)
    navigator.clipboard?.writeText(selected).catch(() => {})
    bioText.value = el.value.substring(0, start) + el.value.substring(end)
    isDirty.value = true
    nextTick(() => {
      el.selectionStart = el.selectionEnd = start
      el.focus()
    })
  }
}

function handleCopy() {
  closeAllMenus()
  if (isDirty.value && textareaEl.value) {
    const start = textareaEl.value.selectionStart
    const end = textareaEl.value.selectionEnd
    if (start !== end) {
      const selected = textareaEl.value.value.substring(start, end)
      navigator.clipboard?.writeText(selected).catch(() => {})
    }
  } else {
    const selected = window.getSelection()?.toString()
    if (selected) {
      navigator.clipboard?.writeText(selected).catch(() => {})
    }
  }
}

async function handlePaste() {
  closeAllMenus()
  if (!isDirty.value) return
  const el = textareaEl.value
  if (!el) return
  try {
    const text = await navigator.clipboard.readText()
    insertAtCursor(text)
  } catch {
    el.focus()
  }
}

function handleDelete() {
  closeAllMenus()
  if (!isDirty.value) return
  const el = textareaEl.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  if (start !== end) {
    bioText.value = el.value.substring(0, start) + el.value.substring(end)
    isDirty.value = true
    nextTick(() => {
      el.selectionStart = el.selectionEnd = start
      el.focus()
    })
  }
}

function handleSelectAll() {
  closeAllMenus()
  if (isDirty.value && textareaEl.value) {
    textareaEl.value.focus()
    textareaEl.value.select()
  } else if (formattedViewEl.value) {
    formattedViewEl.value.focus()
    const range = document.createRange()
    range.selectNodeContents(formattedViewEl.value)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }
}

function handleTimeDate() {
  closeAllMenus()
  if (!isDirty.value) return
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString()
  insertAtCursor(`${timeStr} ${dateStr}`)
}

function insertAtCursor(textToInsert: string) {
  const el = textareaEl.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const before = el.value.substring(0, start)
  const after = el.value.substring(end)
  bioText.value = before + textToInsert + after
  isDirty.value = true
  nextTick(() => {
    el.selectionStart = el.selectionEnd = start + textToInsert.length
    el.focus()
  })
}

function handleToggleWordWrap() {
  closeAllMenus()
  wordWrap.value = !wordWrap.value
}

function openFontDialog() {
  closeAllMenus()
  tempFont.value = currentFont.value
  tempFontSize.value = currentFontSize.value
  showFontDialog.value = true
}

function applyFontDialog() {
  currentFont.value = tempFont.value
  currentFontSize.value = tempFontSize.value
  showFontDialog.value = false
  if (isDirty.value) {
    textareaEl.value?.focus()
  } else {
    formattedViewEl.value?.focus()
  }
}

// -------------------------------------------------------------
// Search Menu Actions
// -------------------------------------------------------------
function openFindDialog() {
  closeAllMenus()
  searchNotFoundMsg.value = false
  showFindDialog.value = true
}

function findNext() {
  if (!searchQuery.value) return

  if (!isDirty.value) {
    if (typeof (window as any).find === 'function') {
      const found = (window as any).find(
        searchQuery.value,
        searchMatchCase.value,
        searchDirection.value === 'up',
        true,
        false,
        false,
        false
      )
      searchNotFoundMsg.value = !found
    } else {
      const text = messages.value.notepad.defaultBio
      const target = searchMatchCase.value ? text : text.toLowerCase()
      const needle = searchMatchCase.value ? searchQuery.value : searchQuery.value.toLowerCase()
      searchNotFoundMsg.value = !target.includes(needle)
    }
    return
  }

  const el = textareaEl.value
  if (!el) return

  const content = el.value
  const query = searchQuery.value
  const matchCase = searchMatchCase.value
  const direction = searchDirection.value

  const searchTarget = matchCase ? content : content.toLowerCase()
  const needle = matchCase ? query : query.toLowerCase()

  let foundIndex = -1

  if (direction === 'down') {
    const startIndex = el.selectionEnd
    foundIndex = searchTarget.indexOf(needle, startIndex)
    if (foundIndex === -1) {
      // Wrap around from beginning
      foundIndex = searchTarget.indexOf(needle, 0)
    }
  } else {
    const startIndex = el.selectionStart > 0 ? el.selectionStart - 1 : 0
    foundIndex = searchTarget.lastIndexOf(needle, startIndex)
    if (foundIndex === -1) {
      // Wrap around from end
      foundIndex = searchTarget.lastIndexOf(needle)
    }
  }

  if (foundIndex !== -1) {
    searchNotFoundMsg.value = false
    el.focus()
    el.setSelectionRange(foundIndex, foundIndex + needle.length)
  } else {
    searchNotFoundMsg.value = true
  }
}

// -------------------------------------------------------------
// Keyboard shortcuts inside textarea
// -------------------------------------------------------------
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
    insertAtCursor('  ')
  } else if (e.key === 'F5') {
    e.preventDefault()
    handleTimeDate()
  } else if (e.key === 'F3') {
    e.preventDefault()
    findNext()
  } else if (e.ctrlKey && e.key.toLowerCase() === 'f') {
    e.preventDefault()
    openFindDialog()
  } else if (e.ctrlKey && e.key.toLowerCase() === 's') {
    e.preventDefault()
    handleSaveFile()
  } else if (e.ctrlKey && e.key.toLowerCase() === 'n') {
    e.preventDefault()
    handleNew()
  }
}

function onFormattedKeyDown(e: KeyboardEvent) {
  if (e.key === 'F3') {
    e.preventDefault()
    findNext()
  } else if (e.ctrlKey && e.key.toLowerCase() === 'f') {
    e.preventDefault()
    openFindDialog()
  } else if (e.ctrlKey && e.key.toLowerCase() === 's') {
    e.preventDefault()
    handleSaveFile()
  } else if (e.ctrlKey && e.key.toLowerCase() === 'a') {
    e.preventDefault()
    handleSelectAll()
  } else if (e.ctrlKey && e.key.toLowerCase() === 'n') {
    e.preventDefault()
    handleNew()
  }
}

// Font CSS mapping
const fontCssFamily = computed(() => {
  switch (currentFont.value) {
    case 'courier':
      return '"Courier New", Courier, monospace'
    case 'lucida':
      return '"Lucida Console", "DejaVu Sans Mono", monospace'
    case 'fixedsys':
      return 'w95fa, "MS Sans Serif", monospace'
    case 'sans':
      return 'w95fa, "MS Sans Serif", Arial, sans-serif'
  }
})

const tempFontCssFamily = computed(() => {
  switch (tempFont.value) {
    case 'courier':
      return '"Courier New", Courier, monospace'
    case 'lucida':
      return '"Lucida Console", "DejaVu Sans Mono", monospace'
    case 'fixedsys':
      return 'w95fa, "MS Sans Serif", monospace'
    case 'sans':
      return 'w95fa, "MS Sans Serif", Arial, sans-serif'
  }
})

onMounted(() => {
  document.addEventListener('pointerdown', onWindowPointerDown)
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    wordWrap.value = true
  }
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onWindowPointerDown)
})
</script>

<template>
  <div class="notepad-app" @contextmenu.prevent>
    <!-- Hidden file input for Open... -->
    <input
      ref="fileInputEl"
      type="file"
      accept=".txt,text/plain"
      style="display: none"
      @change="onFileSelected"
    />

    <!-- Menu Bar (matching notepad.png: File, Edit, Search, Help) -->
    <header class="notepad-menubar">
      <div class="notepad-menus-group">
        <!-- FILE MENU -->
        <div class="notepad-menu" :class="{ 'notepad-menu--open': activeMenu === 'file' }">
          <button
            type="button"
            class="notepad-menu__trigger"
            @pointerdown.stop="toggleMenu('file')"
            @mouseenter="onMenuHover('file')"
          >
            <u>{{ messages.notepad.menu.file[0] }}</u>{{ messages.notepad.menu.file.slice(1) }}
          </button>
          <div v-if="activeMenu === 'file'" class="notepad-dropdown">
            <button type="button" @click="handleNew">
              <span class="notepad-menu-label">{{ messages.notepad.menu.new }}</span>
              <span class="shortcut">Ctrl+N</span>
            </button>
            <button type="button" @click="handleRestoreBio">
              <span class="notepad-menu-label">{{ messages.notepad.menu.restoreBio }}</span>
            </button>
            <button type="button" @click="handleOpenFilePicker">
              <span class="notepad-menu-label">{{ messages.notepad.menu.open }}</span>
              <span class="shortcut">Ctrl+O</span>
            </button>
            <button type="button" @click="handleSaveFile">
              <span class="notepad-menu-label">{{ messages.notepad.menu.save }}</span>
              <span class="shortcut">Ctrl+S</span>
            </button>
            <button type="button" @click="handleSaveFile">
              <span class="notepad-menu-label">{{ messages.notepad.menu.saveAs }}</span>
            </button>
            <hr class="notepad-menu-hr" />
            <button type="button" @click="handlePrint">
              <span class="notepad-menu-label">{{ messages.notepad.menu.print }}</span>
              <span class="shortcut">Ctrl+P</span>
            </button>
            <hr class="notepad-menu-hr" />
            <button type="button" @click="handleExit">
              <span class="notepad-menu-label">{{ messages.notepad.menu.exit }}</span>
            </button>
          </div>
        </div>

        <!-- EDIT MENU -->
        <div class="notepad-menu" :class="{ 'notepad-menu--open': activeMenu === 'edit' }">
          <button
            type="button"
            class="notepad-menu__trigger"
            @pointerdown.stop="toggleMenu('edit')"
            @mouseenter="onMenuHover('edit')"
          >
            <u>{{ messages.notepad.menu.edit[0] }}</u>{{ messages.notepad.menu.edit.slice(1) }}
          </button>
          <div v-if="activeMenu === 'edit'" class="notepad-dropdown">
            <button type="button" @click="handleUndo">
              <span class="notepad-menu-label">{{ messages.notepad.menu.undo }}</span>
              <span class="shortcut">Ctrl+Z</span>
            </button>
            <hr class="notepad-menu-hr" />
            <button type="button" @click="handleCut">
              <span class="notepad-menu-label">{{ messages.notepad.menu.cut }}</span>
              <span class="shortcut">Ctrl+X</span>
            </button>
            <button type="button" @click="handleCopy">
              <span class="notepad-menu-label">{{ messages.notepad.menu.copy }}</span>
              <span class="shortcut">Ctrl+C</span>
            </button>
            <button type="button" @click="handlePaste">
              <span class="notepad-menu-label">{{ messages.notepad.menu.paste }}</span>
              <span class="shortcut">Ctrl+V</span>
            </button>
            <button type="button" @click="handleDelete">
              <span class="notepad-menu-label">{{ messages.notepad.menu.delete }}</span>
              <span class="shortcut">Del</span>
            </button>
            <hr class="notepad-menu-hr" />
            <button type="button" @click="handleSelectAll">
              <span class="notepad-menu-label">{{ messages.notepad.menu.selectAll }}</span>
              <span class="shortcut">Ctrl+A</span>
            </button>
            <button type="button" @click="handleTimeDate">
              <span class="notepad-menu-label">{{ messages.notepad.menu.timeDate }}</span>
              <span class="shortcut">F5</span>
            </button>
            <hr class="notepad-menu-hr" />
            <button type="button" @click="handleToggleWordWrap">
              <span class="notepad-menu-label">
                <span class="check-mark" :style="{ visibility: wordWrap ? 'visible' : 'hidden' }">✓</span>
                {{ messages.notepad.menu.wordWrap }}
              </span>
            </button>
            <button type="button" @click="openFontDialog">
              <span class="notepad-menu-label">{{ messages.notepad.menu.font }}</span>
            </button>
          </div>
        </div>

        <!-- SEARCH MENU -->
        <div class="notepad-menu" :class="{ 'notepad-menu--open': activeMenu === 'search' }">
          <button
            type="button"
            class="notepad-menu__trigger"
            @pointerdown.stop="toggleMenu('search')"
            @mouseenter="onMenuHover('search')"
          >
            <u>{{ messages.notepad.menu.search[0] }}</u>{{ messages.notepad.menu.search.slice(1) }}
          </button>
          <div v-if="activeMenu === 'search'" class="notepad-dropdown">
            <button type="button" @click="openFindDialog">
              <span class="notepad-menu-label">{{ messages.notepad.menu.find }}</span>
              <span class="shortcut">Ctrl+F</span>
            </button>
            <button type="button" @click="findNext">
              <span class="notepad-menu-label">{{ messages.notepad.menu.findNext }}</span>
              <span class="shortcut">F3</span>
            </button>
          </div>
        </div>

        <!-- HELP MENU -->
        <div class="notepad-menu" :class="{ 'notepad-menu--open': activeMenu === 'help' }">
          <button
            type="button"
            class="notepad-menu__trigger"
            @pointerdown.stop="toggleMenu('help')"
            @mouseenter="onMenuHover('help')"
          >
            <u>{{ messages.notepad.menu.help[0] }}</u>{{ messages.notepad.menu.help.slice(1) }}
          </button>
          <div v-if="activeMenu === 'help'" class="notepad-dropdown">
            <button type="button" @click="showHelpDialog = true; closeAllMenus()">
              <span class="notepad-menu-label">{{ messages.notepad.menu.helpTopics }}</span>
            </button>
            <hr class="notepad-menu-hr" />
            <button type="button" @click="showAboutDialog = true; closeAllMenus()">
              <span class="notepad-menu-label">{{ messages.notepad.menu.aboutNotepad }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Client Area: Inset White Box matching notepad.png -->
    <main class="notepad-editor-frame">
      <!-- Vista de Sobre mí: títulos con color, enlaces funcionales y no editable -->
      <div
        v-if="!isDirty"
        ref="formattedViewEl"
        class="notepad-formatted-view"
        :class="{ 'notepad-formatted-view--wrap': wordWrap }"
        :style="{
          fontFamily: fontCssFamily,
          fontSize: `${currentFontSize}px`,
        }"
        tabindex="0"
        v-html="formattedBioHtml"
        @keydown="onFormattedKeyDown"
      />

      <!-- Bloc de notas editable: se activa al pulsar Archivo > Nuevo o abrir un archivo -->
      <textarea
        v-else
        ref="textareaEl"
        v-model="bioText"
        class="notepad-textarea"
        :class="{ 'notepad-textarea--wrap': wordWrap }"
        :style="{
          fontFamily: fontCssFamily,
          fontSize: `${currentFontSize}px`,
        }"
        spellcheck="false"
        @input="onTextChange"
        @keydown="onKeyDown"
      />
    </main>

    <!-- RETRO DIALOG: Find (Ctrl+F) -->
    <div v-if="showFindDialog" class="notepad-modal-backdrop" @click="showFindDialog = false">
      <div class="retro-dialog find-dialog" @click.stop>
        <div class="retro-dialog__titlebar">
          <div class="retro-dialog__title">{{ messages.notepad.dialogs.findTitle }}</div>
          <button type="button" class="retro-dialog__close" @click="showFindDialog = false">×</button>
        </div>
        <div class="retro-dialog__body find-dialog__body">
          <div class="find-form-left">
            <div class="find-input-row">
              <label for="find-what-input">{{ messages.notepad.dialogs.findWhat }}</label>
              <input
                id="find-what-input"
                v-model="searchQuery"
                type="text"
                class="retro-input"
                autofocus
                @keydown.enter.prevent="findNext"
              />
            </div>
            <div class="find-options-row">
              <label class="retro-checkbox-label">
                <input v-model="searchMatchCase" type="checkbox" />
                {{ messages.notepad.dialogs.matchCase }}
              </label>
              <fieldset class="retro-fieldset">
                <legend>{{ messages.notepad.dialogs.direction }}</legend>
                <label>
                  <input v-model="searchDirection" type="radio" value="up" />
                  {{ messages.notepad.dialogs.up }}
                </label>
                <label>
                  <input v-model="searchDirection" type="radio" value="down" />
                  {{ messages.notepad.dialogs.down }}
                </label>
              </fieldset>
            </div>
            <div v-if="searchNotFoundMsg" class="find-not-found">
              {{ messages.notepad.dialogs.notFound }}
            </div>
          </div>
          <div class="find-form-right">
            <button type="button" class="retro-button" @click="findNext">
              {{ messages.notepad.dialogs.findNextBtn }}
            </button>
            <button type="button" class="retro-button" @click="showFindDialog = false">
              {{ messages.notepad.dialogs.cancelBtn }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- RETRO DIALOG: Font -->
    <div v-if="showFontDialog" class="notepad-modal-backdrop" @click="showFontDialog = false">
      <div class="retro-dialog font-dialog" @click.stop>
        <div class="retro-dialog__titlebar">
          <div class="retro-dialog__title">{{ messages.notepad.dialogs.fontTitle }}</div>
          <button type="button" class="retro-dialog__close" @click="showFontDialog = false">×</button>
        </div>
        <div class="retro-dialog__body font-dialog__body">
          <div class="font-selectors-row">
            <div class="font-col">
              <label>{{ messages.notepad.dialogs.fontFamily }}</label>
              <div class="retro-listbox">
                <div
                  class="retro-listbox-item"
                  :class="{ selected: tempFont === 'courier' }"
                  @click="tempFont = 'courier'"
                >Courier New</div>
                <div
                  class="retro-listbox-item"
                  :class="{ selected: tempFont === 'lucida' }"
                  @click="tempFont = 'lucida'"
                >Lucida Console</div>
                <div
                  class="retro-listbox-item"
                  :class="{ selected: tempFont === 'fixedsys' }"
                  @click="tempFont = 'fixedsys'"
                >Fixedsys / W95FA</div>
                <div
                  class="retro-listbox-item"
                  :class="{ selected: tempFont === 'sans' }"
                  @click="tempFont = 'sans'"
                >MS Sans Serif</div>
              </div>
            </div>
            <div class="font-col font-col--size">
              <label>{{ messages.notepad.dialogs.fontSize }}</label>
              <div class="retro-listbox">
                <div
                  v-for="size in [11, 13, 15, 18]"
                  :key="size"
                  class="retro-listbox-item"
                  :class="{ selected: tempFontSize === size }"
                  @click="tempFontSize = size"
                >{{ size }} pt</div>
              </div>
            </div>
          </div>

          <!-- Sample Preview -->
          <fieldset class="retro-fieldset font-sample-fieldset">
            <legend>{{ messages.notepad.dialogs.sampleText }}</legend>
            <div
              class="font-sample-box"
              :style="{ fontFamily: tempFontCssFamily, fontSize: `${tempFontSize}px` }"
            >
              AaBbYyZz 0123456789
            </div>
          </fieldset>

          <div class="dialog-actions-row">
            <button type="button" class="retro-button" @click="applyFontDialog">
              {{ messages.notepad.dialogs.okBtn }}
            </button>
            <button type="button" class="retro-button" @click="showFontDialog = false">
              {{ messages.notepad.dialogs.cancelBtn }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- RETRO DIALOG: Help Topics -->
    <div v-if="showHelpDialog" class="notepad-modal-backdrop" @click="showHelpDialog = false">
      <div class="retro-dialog help-dialog" @click.stop>
        <div class="retro-dialog__titlebar">
          <div class="retro-dialog__title">{{ messages.notepad.menu.helpTopics }}</div>
          <button type="button" class="retro-dialog__close" @click="showHelpDialog = false">×</button>
        </div>
        <div class="retro-dialog__body help-dialog__body">
          <div class="help-info-content">
            <h4>Notepad Portfolio Edition</h4>
            <p>• <strong>F5</strong>: Inserta fecha y hora actual en la posición del cursor.</p>
            <p>• <strong>Ctrl+F / F3</strong>: Busca texto en el documento hacia arriba o hacia abajo.</p>
            <p>• <strong>Edición > Ajuste de línea</strong>: Alterna entre desplazamiento horizontal libre y ajuste al ancho.</p>
            <p>• <strong>Archivo > Guardar</strong>: Descarga el archivo de texto directamente a tu equipo.</p>
            <p>• <strong>Archivo > Restaurar</strong>: Vuelve a cargar la biografía original en el idioma seleccionado.</p>
          </div>
          <div class="dialog-actions-row">
            <button type="button" class="retro-button" @click="showHelpDialog = false">
              {{ messages.notepad.dialogs.aboutOk }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- RETRO DIALOG: About Notepad (Windows 95 Classic) -->
    <div v-if="showAboutDialog" class="notepad-modal-backdrop" @click="showAboutDialog = false">
      <div class="retro-dialog about-dialog" @click.stop>
        <div class="retro-dialog__titlebar">
          <div class="retro-dialog__title">{{ messages.notepad.dialogs.aboutTitle }}</div>
          <button type="button" class="retro-dialog__close" @click="showAboutDialog = false">×</button>
        </div>
        <div class="retro-dialog__body about-dialog__body">
          <div class="about-header-row">
            <img :src="wordpadIcon" alt="Notepad Icon" class="about-icon" />
            <div class="about-titles">
              <h3>{{ messages.notepad.dialogs.aboutHeading }}</h3>
              <p class="about-sub">{{ messages.notepad.dialogs.aboutSubheading }}</p>
            </div>
          </div>
          <hr class="retro-dialog-hr" />
          <div class="about-details">
            <p><strong>{{ messages.notepad.dialogs.aboutDev }}</strong></p>
            <p>{{ messages.notepad.dialogs.aboutSpecialty }}</p>
            <p class="stats-line">{{ messages.notepad.dialogs.aboutMemory }}</p>
            <p class="stats-line">{{ messages.notepad.dialogs.aboutResources }}</p>
          </div>
          <div class="dialog-actions-row">
            <button type="button" class="retro-button" @click="showAboutDialog = false">
              {{ messages.notepad.dialogs.aboutOk }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* -------------------------------------------------------------
   Notepad Base Container
------------------------------------------------------------- */
.notepad-app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  box-sizing: border-box;
  background: #c0c0c0;
  color: #000;
  font-family: 'w95fa', 'MS Sans Serif', sans-serif;
  user-select: none;
  overflow: hidden;
  position: relative;
}

/* -------------------------------------------------------------
   Menubar (Exact match to notepad.png)
------------------------------------------------------------- */
.notepad-menubar {
  display: flex;
  align-items: center;
  height: 22px;
  min-height: 22px;
  background: #c0c0c0;
  padding: 1px 2px;
  box-sizing: border-box;
  font-size: 11px;
}

.notepad-menus-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.notepad-menu {
  position: relative;
}

.notepad-menu__trigger {
  height: 19px;
  line-height: 17px;
  padding: 0 6px;
  border: 1px solid transparent;
  background: transparent;
  color: #000;
  font-family: inherit;
  font-size: 11px;
  cursor: default;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.notepad-menu__trigger:hover,
.notepad-menu--open .notepad-menu__trigger {
  background: #000080;
  color: #ffffff;
}

.notepad-menu__trigger u {
  text-decoration: underline;
}

/* -------------------------------------------------------------
   Dropdown Menus
------------------------------------------------------------- */
.notepad-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 190px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #404040 #404040 #ffffff;
  box-shadow: 2px 2px 0 #000000;
  padding: 2px;
  display: flex;
  flex-direction: column;
}

.notepad-dropdown button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 3px 8px;
  border: none;
  background: transparent;
  color: #000;
  font-family: inherit;
  font-size: 11px;
  text-align: left;
  cursor: default;
  box-sizing: border-box;
}

.notepad-menu-label {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.check-mark {
  display: inline-block;
  width: 14px;
  font-weight: bold;
}

.notepad-dropdown button:hover {
  background: #000080;
  color: #ffffff;
}

.notepad-dropdown .shortcut {
  margin-left: 16px;
  font-size: 11px;
  color: inherit;
}

.notepad-menu-hr {
  margin: 2px 1px;
  border: 0;
  border-top: 1px solid #808080;
  border-bottom: 1px solid #ffffff;
}

/* -------------------------------------------------------------
   Editor Client Area (Matching notepad.png sunken border)
------------------------------------------------------------- */
.notepad-editor-frame {
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-sizing: border-box;
  /* Classic 3D Sunken Border */
  border: 1px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #dfdfdf;
  overflow: hidden;
  position: relative;
  container-type: inline-size;
  container-name: notepad-frame;
}

.notepad-textarea,
.notepad-formatted-view {
  flex: 1;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 4px 6px;
  border: none;
  outline: none;
  resize: none;
  box-sizing: border-box;
  background: #ffffff;
  color: #000000;
  line-height: 1.45;
  tab-size: 4;
  user-select: text;
  /* Default: Horizontal scrollbar active matching notepad.png */
  white-space: pre;
  overflow-x: scroll;
  overflow-y: scroll;
}

.notepad-formatted-view {
  cursor: text;
}

.notepad-textarea--wrap,
.notepad-formatted-view--wrap {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: hidden;
}

/* -------------------------------------------------------------
   Custom Windows 95 Scrollbars (Matching notepad.png)
------------------------------------------------------------- */
.notepad-textarea::-webkit-scrollbar,
.notepad-formatted-view::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

.notepad-textarea::-webkit-scrollbar-track,
.notepad-formatted-view::-webkit-scrollbar-track {
  background: #dfdfdf;
  background-image: radial-gradient(#808080 25%, transparent 25%), radial-gradient(#808080 25%, #dfdfdf 25%);
  background-position: 0 0, 1px 1px;
  background-size: 2px 2px;
}

.notepad-textarea::-webkit-scrollbar-thumb,
.notepad-formatted-view::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  box-shadow: inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080;
}

.notepad-textarea::-webkit-scrollbar-button,
.notepad-formatted-view::-webkit-scrollbar-button {
  width: 16px;
  height: 16px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  box-shadow: inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080;
  background-repeat: no-repeat;
  background-position: center;
}


/* -------------------------------------------------------------
   Bio Formatted Elements (Titles, Links, Separators)
------------------------------------------------------------- */
:deep(.bio-separator) {
  color: #000080;
  font-weight: bold;
  opacity: 0.8;
  display: block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: clip;
}

:deep(.bio-main-title) {
  color: #000080;
  font-weight: bold;
  font-size: 1.15em;
  display: inline-block;
  max-width: 100%;
  overflow-wrap: anywhere;
}

:deep(.bio-subtitle) {
  color: #00529b;
  font-weight: bold;
  display: inline-block;
  max-width: 100%;
  overflow-wrap: anywhere;
}

:deep(.bio-profile-photo-card) {
  float: right;
  margin: 4px 16px 14px 24px;
}

:deep(.bio-profile-photo) {
  width: 210px;
  height: 275px;
  object-fit: cover;
  object-position: center top;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  box-shadow: inset 1px 1px 0 #000000, 1px 1px 0 #404040;
  background: #c0c0c0;
  padding: 3px;
  display: block;
}

:deep(.bio-section-title) {
  color: #000080;
  font-weight: bold;
  display: inline-block;
  background: #e8f0fe;
  padding: 1px 6px;
  border-left: 3px solid #000080;
  margin: 6px 0 3px;
  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

:deep(.bio-bullet),
:deep(.bio-key) {
  color: #000080;
  font-weight: bold;
}

:deep(.bio-link) {
  color: #0000cc;
  text-decoration: underline;
  cursor: pointer;
  font-weight: bold;
  word-break: break-all;
  overflow-wrap: anywhere;
}

:deep(.bio-link:hover) {
  color: #cc0000;
  background-color: #ffffcc;
}

:deep(.bio-note) {
  color: #555555;
  font-style: italic;
  display: block;
  max-width: 100%;
  overflow-wrap: anywhere;
}

/* -------------------------------------------------------------
   Retro Dialogs & Modals
------------------------------------------------------------- */
.notepad-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.retro-dialog {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  box-shadow: 2px 2px 0 #000000;
  padding: 3px;
  box-sizing: border-box;
  font-family: 'w95fa', 'MS Sans Serif', sans-serif;
  color: #000;
  max-width: 95%;
}

.retro-dialog__titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  background: #000080;
  color: #ffffff;
  padding: 2px 4px;
  font-weight: bold;
  font-size: 12px;
}

.retro-dialog__close {
  width: 16px;
  height: 16px;
  background: #c0c0c0;
  color: #000000;
  border: 2px solid;
  border-color: #ffffff #404040 #404040 #ffffff;
  font-size: 11px;
  line-height: 12px;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
}

.retro-dialog__body {
  padding: 10px;
  font-size: 12px;
}

/* Retro Inputs & Buttons */
.retro-button {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #000000 #000000 #ffffff;
  box-shadow: inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080;
  font-family: inherit;
  font-size: 11px;
  padding: 3px 12px;
  cursor: pointer;
  min-width: 70px;
}

.retro-button:active {
  border-color: #000000 #ffffff #ffffff #000000;
  box-shadow: inset 1px 1px 0 #808080;
}

.retro-input {
  background: #ffffff;
  border: 2px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
  box-shadow: inset 1px 1px 0 #000000;
  padding: 2px 4px;
  font-family: inherit;
  font-size: 12px;
  outline: none;
}

.retro-fieldset {
  border: 2px groove #dfdfdf;
  padding: 6px 10px;
  margin: 8px 0;
  font-size: 11px;
}

.retro-fieldset legend {
  padding: 0 4px;
}

.dialog-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

/* Find Dialog */
.find-dialog {
  width: 380px;
}

.find-dialog__body {
  display: flex;
  gap: 12px;
}

.find-form-left {
  flex: 1;
}

.find-form-right {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.find-input-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.find-options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.retro-checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 11px;
}

.find-not-found {
  color: #c00000;
  font-size: 11px;
  margin-top: 6px;
}

/* Font Dialog */
.font-dialog {
  width: 380px;
}

.font-selectors-row {
  display: flex;
  gap: 12px;
}

.font-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.font-col--size {
  max-width: 90px;
}

.retro-listbox {
  background: #ffffff;
  border: 2px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
  box-shadow: inset 1px 1px 0 #000000;
  height: 90px;
  overflow-y: auto;
}

.retro-listbox-item {
  padding: 2px 6px;
  font-size: 11px;
  cursor: pointer;
}

.retro-listbox-item:hover {
  background: #e0e0e0;
}

.retro-listbox-item.selected {
  background: #000080;
  color: #ffffff;
}

.font-sample-box {
  height: 48px;
  background: #ffffff;
  border: 1px solid #808080;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* About Notepad Dialog */
.about-dialog {
  width: 360px;
}

.about-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.about-icon {
  width: 36px;
  height: 36px;
  image-rendering: pixelated;
}

.about-titles h3 {
  margin: 0;
  font-size: 14px;
  color: #000080;
}

.about-sub {
  margin: 2px 0 0;
  font-size: 11px;
  color: #333333;
}

.retro-dialog-hr {
  border: 0;
  border-top: 1px solid #808080;
  border-bottom: 1px solid #ffffff;
  margin: 8px 0;
}

.about-details p {
  margin: 3px 0;
  font-size: 11px;
}

.stats-line {
  color: #444444;
}

/* Help Dialog */
.help-dialog {
  width: 380px;
}

.help-info-content h4 {
  margin: 0 0 6px;
  color: #000080;
}

.help-info-content p {
  margin: 4px 0;
  font-size: 11px;
  line-height: 1.35;
}

@media (max-width: 768px) {
  .notepad-menubar {
    overflow-x: auto;
    white-space: nowrap;
    padding: 0 1px;
    height: 24px;
    min-height: 24px;
  }

  .notepad-textarea,
  .notepad-formatted-view {
    white-space: pre-wrap !important;
    word-break: break-word !important;
    overflow-wrap: anywhere !important;
    overflow-x: hidden !important;
    font-size: 11px !important;
    line-height: 1.42 !important;
    padding: 6px 8px !important;
    -webkit-overflow-scrolling: touch;
  }

  .notepad-textarea::-webkit-scrollbar,
  .notepad-formatted-view::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .notepad-textarea::-webkit-scrollbar-button,
  .notepad-formatted-view::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
  }


}

/* Container queries: triggers in real time when user resizes the window */
@container notepad-frame (max-width: 720px) {
  :deep(.bio-profile-photo) {
    width: 180px;
    height: 236px;
  }
}

@container notepad-frame (max-width: 600px) {
  :deep(.bio-profile-photo-card) {
    float: none;
    clear: both;
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 8px auto 14px;
  }

  :deep(.bio-profile-photo) {
    width: 170px;
    height: 225px;
    margin: 4px 0 8px;
  }
}

@container notepad-frame (max-width: 440px) {
  :deep(.bio-profile-photo) {
    width: 145px;
    height: 190px;
  }
}

@media (max-width: 480px) {
  :deep(.bio-profile-photo-card) {
    float: none;
    clear: both;
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 8px auto 14px;
  }

  :deep(.bio-profile-photo) {
    width: 145px;
    height: 190px;
    margin: 4px 0 8px;
  }

  .find-dialog,
  .font-dialog,
  .help-dialog,
  .about-dialog {
    width: 92vw;
  }
}
</style>
