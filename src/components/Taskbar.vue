<!-- Taskbar.vue -->
<script setup lang="ts">
// import { useWindowsStore } from '@/stores/windows'
// import StartButton from './StartButton.vue'
// import StartMenu from './StartMenu.vue'
// import TaskbarItem from './TaskbarItem.vue'

// const store = useWindowsStore()
// const menuOpen = ref(false)

import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n, type Locale } from '../i18n'

const time = ref('')
const { locale, messages, setLocale, locales } = useI18n()
const languageOpen = ref(false)
const languageMenu = ref<HTMLElement | null>(null)
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

function selectLanguage(nextLocale: Locale) {
  setLocale(nextLocale)
  languageOpen.value = false
}

function closeLanguageMenu(event: PointerEvent) {
  if (!languageMenu.value?.contains(event.target as Node)) {
    languageOpen.value = false
  }
}

onMounted(() => document.addEventListener('pointerdown', closeLanguageMenu))
onUnmounted(() => document.removeEventListener('pointerdown', closeLanguageMenu))
</script>

<template>
  <footer class="taskbar">
    <!-- <StartMenu v-if="menuOpen" @close="menuOpen = false" />
    <StartButton :pressed="menuOpen" @click="menuOpen = !menuOpen" />

    <div class="taskbar__items">
      <TaskbarItem
        v-for="w in store.windows"
        :key="w.id"
        :window="w"
        :active="store.activeId === w.id"
        @click="store.activeId === w.id ? store.minimize(w.id) : store.focus(w.id)"
      />
    </div>  -->
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
      <span class="clock">{{ time }}</span>
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
  .language__button {
    min-width: 48px;
    padding-right: 20px;
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
    min-width: 48px;
    padding: 0 4px;
  }

  .clock {
    font-size: 14px;
  }
}
</style>