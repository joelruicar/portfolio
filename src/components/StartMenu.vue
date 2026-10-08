<script setup lang="ts">
import minesweeperIcon from '../assets/minesweeper/img/Icon.png'
import { useI18n } from '../i18n'

const emit = defineEmits<{
  openMinesweeper: []
}>()

const { messages } = useI18n()
</script>

<template>
  <div class="start-menu" role="menu">
    <button class="start-menu__item" type="button" role="menuitem" @click="emit('openMinesweeper')">
      <img :src="minesweeperIcon" alt="">
      <span>{{ messages.minesweeper }}</span>
    </button>
  </div>
</template>

<style scoped>
.start-menu {
  position: absolute;
  bottom: 31px;
  left: 2px;
  z-index: 10001;
  min-width: 170px;
  padding: 2px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  box-shadow: 2px 2px #000;
}

.start-menu__item {
  display: flex;
  width: 100%;
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
  image-rendering: pixelated;
}
</style>