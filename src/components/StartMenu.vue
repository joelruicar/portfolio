<script setup lang="ts">
import minesweeperIcon from '../assets/minesweeper/img/Icon.png'
import explorerIcon from '../assets/explorer.ico'
import linkedIcon from '../assets/linked.ico'
import gitIcon from '../assets/git.ico'
import promptIcon from '../assets/prompt.ico'
import { useI18n } from '../i18n'

const emit = defineEmits<{
  openMinesweeper: []
}>()

const { messages } = useI18n()

const menuItems = [
  { key: 'programs', icon: explorerIcon },
  { key: 'documents', icon: linkedIcon },
  { key: 'settings', icon: gitIcon },
  { key: 'run', icon: promptIcon },
] as const
</script>

<template>
  <div class="start-menu" role="menu">
    <div class="start-menu__brand" aria-hidden="true">
      <span>Windows</span>
      <strong>95</strong>
    </div>
    <div class="start-menu__items">
      <button
        v-for="item in menuItems"
        :key="item.key"
        class="start-menu__item"
        type="button"
        role="menuitem"
        @click="item.key === 'programs' && emit('openMinesweeper')"
      >
        <img :src="item.key === 'programs' ? minesweeperIcon : item.icon" alt="">
        <span>{{ item.key === 'programs' ? messages.minesweeper : messages.startMenu[item.key] }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.start-menu {
  position: absolute;
  bottom: 31px;
  left: 2px;
  z-index: 10001;
  display: flex;
  min-width: 220px;
  padding: 0;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  box-shadow: 2px 2px #000;
}

.start-menu__brand {
  display: flex;
  width: 28px;
  flex: 0 0 28px;
  align-items: flex-end;
  justify-content: center;
  padding: 6px 2px;
  color: #fff;
  background: #808080;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.start-menu__brand span {
  font-size: 16px;
  font-weight: bold;
}

.start-menu__brand strong {
  margin-top: 4px;
  color: #c0c0c0;
  font-size: 17px;
}

.start-menu__items {
  flex: 1;
  padding: 2px;
}

.start-menu__item {
  display: flex;
  width: 100%;
  min-height: 32px;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  color: #000;
  background: transparent;
  border: 0;
  font: inherit;
  text-align: left;
  cursor: default;
}

.start-menu__item:hover {
  color: #fff;
  background: #000080;
}

.start-menu__item img {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  image-rendering: pixelated;
}

</style>