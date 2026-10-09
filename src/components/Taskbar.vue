<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n, type Locale } from '../i18n'
import { useWindowsStore } from '../stores/windows'
import StartMenu from './StartMenu.vue'
import minesweeperIcon from '../assets/minesweeper/img/Icon.png'
import promptIcon from '../assets/prompt.ico'
import soundIcon from '../assets/sound.svg'
import start from '../assets/start.ico'
const store = useWindowsStore()
const time = ref('')
const menuOpen = ref(false)
const { locale, messages, setLocale, locales } = useI18n()
const languageOpen = ref(false)
const languageMenu = ref<HTMLElement | null>(null)
const startMenu = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setInterval>

function updateTime() {
  time.value = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => clearInterval(timer))

function toggleLanguageMenu() {
  languageOpen.value = !languageOpen.value
}

function openMinesweeper() {
  store.open({
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: minesweeperIcon,
    folder: 'minesweeper',
  })
  menuOpen.value = false
}

function openCMD() {
  store.open({
    id: 'run',
    title: 'CMD',
    icon: promptIcon,
    folder: 'run',
  })
  menuOpen.value = false
}

function selectLanguage(nextLocale: Locale) {
  setLocale(nextLocale)
  languageOpen.value = false
}

function toggleWindow(id: string) {
  const selectedWindow = store.windows.find((window) => window.id === id)
  if (!selectedWindow) return

  if (store.activeId === id && !selectedWindow.minimized) {
    store.minimize(id)
    return
  }

  store.focus(id)
}

function closeLanguageMenu(event: PointerEvent) {
  if (!languageMenu.value?.contains(event.target as Node)) {
    languageOpen.value = false
  }
}

function closeStartMenu(event: PointerEvent) {
  if (!startMenu.value?.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', closeLanguageMenu)
  document.addEventListener('pointerdown', closeStartMenu)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', closeLanguageMenu)
  document.removeEventListener('pointerdown', closeStartMenu)
})
</script>

<template>
  <footer class="taskbar">
    <div ref="startMenu" class="start-area">
      <button
        class="start-button"
        :class="{ 'start-button--active': menuOpen }"
        type="button"
        aria-label="Start"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <img :src="start" alt="" /> <span>{{ messages.socials }}</span>
      </button>
      <StartMenu v-if="menuOpen" @open-minesweeper="openMinesweeper" @open-cmd="openCMD" />
    </div>
    <div class="taskbar__items">
      <button
        v-for="window in store.windows"
        :key="window.id"
        class="taskbar__item"
        :class="{ 'taskbar__item--active': store.activeId === window.id && !window.minimized }"
        type="button"
        :aria-pressed="store.activeId === window.id && !window.minimized"
        @click="toggleWindow(window.id)"
      >
        <img v-if="window.icon.endsWith('.ico')" :src="window.icon" alt="" />
        <span>{{ messages[window.folder] }}</span>
      </button>
    </div>
    <div ref="languageMenu" class="language">
      <span class="sr-only">{{ messages.language }}</span>
      <button
        class="language__button"
        type="button"
        :aria-label="messages.language"
        :aria-expanded="languageOpen"
        @click="toggleLanguageMenu"
      >
        {{ messages.languageNames[locale] }}
      </button>
      <div v-if="languageOpen" class="language__menu" role="menu">
        <button
          v-for="availableLocale in locales"
          :key="availableLocale"
          class="language__option"
          :class="{ 'language__option--selected': availableLocale === locale }"
          type="button"
          role="menuitem"
          @click="selectLanguage(availableLocale)"
        >
          {{ messages.languageNames[availableLocale] }}
        </button>
      </div>
    </div>
    <div class="tray">
      <span class="clock"> <image :src="soundIcon" alt=""/>{{ time }}</span>
    </div>
  </footer>
</template>

<style scoped>
.taskbar {
  position: fixed;
  inset: auto 0 0 0;
  height: 35px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  z-index: 9999; 
}
.taskbar__items { display: flex; gap: 2px; flex: 1; }

.start-button,
.taskbar__item {
  height: 29px;
  color: #000;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  font: inherit;
  font-weight: bold;
  cursor: pointer;
}

.start-button {
  min-width: 42px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.start-button img {
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
}

.start-button:active,
.start-button--active,
.taskbar__item--active {
  border-color: #404040 #fff #fff #404040;
  background: #C0C0C0;
}

.taskbar__item {
  display: flex;
  min-width: 120px;
  max-width: 220px;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  overflow: hidden;
  text-align: left;
}

.taskbar__item img {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}

.taskbar__item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tray {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 100%;
  border: 1px solid;
  border-color: #808080 #fff #fff #808080;
}

.clock {
  font-size: 20px;
}
.language {
  position: relative;
  margin-left: auto;
}

.language__button,
.language__option {
  color: #000;
  background-color: #c0c0c0;
  border: 1px solid;
  border-color: #808080 #fff #fff #808080;
  font: inherit;
  cursor: pointer;
}

.language__button {
  position: relative;
  min-width: 100px;
  min-height: 27px;
  padding: 2px 24px 2px 6px;
  text-align: left;
}

.language__button::after {
  position: absolute;
  top: 50%;
  right: 6px;
  color: #000;
  content: '▼';
  font-size: 10px;
  line-height: 1;
  transform: translateY(-50%);
}

.language__menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 2px);
  display: flex;
  min-width: 100%;
  flex-direction: column;
  padding: 2px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  z-index: 10000;
}

.language__option {
  padding: 3px 8px;
  border: 0;
  text-align: left;
  white-space: nowrap;
}

.language__option:hover,
.language__option--selected {
  color: #fff;
  background-color: #000080;
}

.language {
  margin-left: auto;
}
.sr-only {
  position: absolute;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

@media screen and (max-width: 699px) {
  .taskbar {
    gap: 2px;
  }

  .start-area {
    flex: 0 0 auto;
  }

  .taskbar__items {
    min-width: 0;
    gap: 1px;
  }

  .start-button,
  .taskbar__item {
    height: 27px;
  }

  .start-button {
    min-width: 0;
    padding: 2px 4px;
  }

  .taskbar__item {
    min-width: 0;
    flex: 1 1 0;
    justify-content: center;
    padding: 2px 3px;
  }

  .taskbar__item img {
    width: 14px;
    height: 14px;
  }

  .taskbar__item span {
    min-width: 0;
    font-size: 11px;
  }

  .language__button {
    min-width: 0;
    padding: 2px 16px 2px 4px;
    font-size: 12px;
  }

  .language__menu {
    min-width: 48px;
  }

  .language__option {
    padding: 3px 5px;
    font-size: 12px;
  }

  .tray {
    min-width: 0;
    padding: 0 4px;
  }

  .clock {
    font-size: 14px;
  }
}

@media screen and (max-width: 420px) {
  .start-button span,
  .taskbar__item span {
    display: none;
  }

  .start-button {
    width: 30px;
    justify-content: center;
  }

  .taskbar__item {
    min-width: 24px;
  }

  .language__button {
    width: 34px;
    padding: 2px 14px 2px 3px;
  }

  .tray {
    padding: 0 2px;
  }
}
</style>