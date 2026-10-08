<script setup lang="ts">
// The original game is JavaScript; its internal state is intentionally preserved during integration.
// @ts-nocheck
import { onMounted, onUnmounted, ref } from 'vue'
import Grid from '../minesweeper/Grid.vue'
import Menu from '../minesweeper/Menu.vue'

const asset = (name) => new URL(`../../assets/minesweeper/img/${name}`, import.meta.url).href

let bArray = []
let tArray = []
let time = 0
let bombs = 10
let col = 7
let row = 7
let gameStop = false
let bombCount = bombs
let interval
const fromChild = ref()
const gridKey = ref(0)
const faceState = ref('')
const menuOpen = ref(false)
const ldArray = ref([])
const rdArray = ref([])

const createDisplayUrlArray = (number, array, display) => {
  const digits = number.toString().split('')
  if (digits.length > 3) return

  while (digits.length < 3) digits.unshift('0')
  digits.forEach((digit, index) => {
    display[index] = asset(`${digit}-info.png`)
  })
  array.length = digits.length
}

const gameWon = () => {
  faceState.value = 'won'
  gameStop = true
  bombCount = 0
  createDisplayUrlArray(bombs, bArray, ldArray.value)
}

const gameLost = () => {
  faceState.value = 'lost'
  gameStop = true
}

const mouseDown = () => {
  if (!gameStop) faceState.value = 'o-o'
}

const mouseUp = () => {
  if (!gameStop) faceState.value = ''
}

const faceClick = () => {
  faceState.value = 'click'
}

const faceUnClick = () => {
  faceState.value = ''
}

const changeFace = () => {
  const faces = {
    won: 'chill-face.png',
    lost: 'dead-face.png',
    'o-o': 'o-o-face.png',
    click: 'happy-face-clicked.png',
  }
  return asset(faces[faceState.value] || 'happy-face.png')
}

const updateTime = () => {
  time += 1
  createDisplayUrlArray(time, tArray, rdArray.value)
}

const listenPlay = () => {
  if (interval || gameStop) return
  updateTime()
  interval = setInterval(updateTime, 1000)
}

const listenPause = () => {
  clearInterval(interval)
  interval = undefined
}

const listenInflag = () => {
  bombCount -= 1
  createDisplayUrlArray(bombCount, bArray, ldArray.value)
}

const listenOutflag = () => {
  bombCount += 1
  createDisplayUrlArray(bombCount, bArray, ldArray.value)
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const difficulty = (difficultyName) => {
  if (difficultyName === 'hard') {
    col = 23
    row = 23
    bombs = 99
  } else if (difficultyName === 'inter') {
    col = 15
    row = 15
    bombs = 40
  } else {
    col = 7
    row = 7
    bombs = 10
  }
  reloadGrid()
}

const reloadGrid = () => {
  faceState.value = ''
  gameStop = false
  time = 0
  bombCount = bombs
  gridKey.value += 1
  listenPause()
  fromChild.value?.gameInit()
  createDisplayUrlArray(bombs, bArray, ldArray.value)
  createDisplayUrlArray(time, tArray, rdArray.value)
  menuOpen.value = false
}

onMounted(() => {
  createDisplayUrlArray(bombs, bArray, ldArray.value)
  createDisplayUrlArray(time, tArray, rdArray.value)
})

onUnmounted(listenPause)
</script>

<template>
  <section class="minesweeper">
    <div class="minesweeper__menu-bar">
      <button
        class="minesweeper__menu-button"
        :class="{ 'minesweeper__menu-button--active': menuOpen }"
        type="button"
        @click.stop="toggleMenu"
      >Game</button>
      <Menu
        v-show="menuOpen"
        @click.stop="toggleMenu"
        @newgame="reloadGrid"
        @dif="difficulty"
      />
      <button class="minesweeper__menu-button" type="button">Help</button>
    </div>

    <div class="minesweeper__game">
      <div class="minesweeper__game-panel">
        <div class="minesweeper__display-row">
          <div class="minesweeper__display">
            <img v-for="image in ldArray" :key="image" :src="image" alt="">
          </div>
          <button class="minesweeper__face" type="button" @click="reloadGrid">
            <img
              :src="changeFace()"
              alt="Reset game"
              @mousedown.left="faceClick"
              @mouseup.left="faceUnClick"
              @touchstart="faceClick"
              @touchend="faceUnClick"
            >
          </button>
          <div class="minesweeper__display">
            <img v-for="image in rdArray" :key="image" :src="image" alt="">
          </div>
        </div>
        <div
          :key="gridKey"
          class="minesweeper__grid"
          @mousedown.left="mouseDown"
          @mouseup.left="mouseUp"
          @touchstart="mouseDown"
          @touchend="mouseUp"
        >
          <Grid
            ref="fromChild"
            :bombs="bombs"
            :col="col"
            :row="row"
            @play.once="listenPlay"
            @pause.once="listenPause"
            @flaged="listenInflag"
            @unflaged="listenOutflag"
            @win="gameWon"
            @lose="gameLost"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@font-face {
  font-family: minesweeper-sans;
  src: url('../../assets/minesweeper/font/MS-Sans-Serif.ttf') format('truetype');
}

.minesweeper {
  width: fit-content;
  min-width: 238px;
  padding: 2px;
  color: #000;
  background: #c3c3c3;
  font-family: minesweeper-sans, sans-serif;
  font-size: 12px;
  line-height: 1;
  user-select: none;
}

.minesweeper__menu-bar {
  position: relative;
  display: flex;
  height: 21px;
  align-items: center;
}

.minesweeper__menu-button {
  padding: 3px 7px;
  border: 1px solid transparent;
  color: #000;
  background: transparent;
  font: inherit;
  cursor: default;
}

.minesweeper__menu-button:hover,
.minesweeper__menu-button--active {
  border-color: #818181 #fff #fff #818181;
}

.minesweeper__game {
  padding: 4px;
  border: 3px solid;
  border-color: #818181 #fff #fff #818181;
}

.minesweeper__game-panel {
  padding: 6px;
  border: 2px solid;
  border-color: #818181 #fff #fff #818181;
}

.minesweeper__display-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  padding: 3px;
  border: 2px solid;
  border-color: #818181 #fff #fff #818181;
}

.minesweeper__display {
  display: flex;
  width: 41px;
  height: 25px;
  padding: 1px;
  background: #000;
}

.minesweeper__display img {
  width: 13px;
  height: 23px;
}

.minesweeper__face {
  padding: 0;
  border: 2px solid;
  border-color: #fff #818181 #818181 #fff;
  background: #c3c3c3;
}

.minesweeper__face:active {
  border-color: #818181 #fff #fff #818181;
}

.minesweeper__face img {
  display: block;
  width: 26px;
  height: 26px;
  image-rendering: pixelated;
}

.minesweeper__grid {
  display: flex;
  justify-content: center;
  overflow: auto;
  padding: 3px;
  border: 3px solid;
  border-color: #818181 #fff #fff #818181;
}

@media (max-width: 520px) {
  .minesweeper {
    transform: scale(0.85);
    transform-origin: top left;
  }
}
</style>
