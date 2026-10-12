<script setup>
import Tile from "./Tile.vue";
import { onMounted, ref } from "vue";

const props = defineProps({
    bombs: Number,
    col: Number,
    row: Number,
})

let placed = false;
const emit = defineEmits(['play', 'pause', 'flaged', 'unflaged', 'win', 'lose'])

const col = props.col
const row = props.row
const bombs = props.bombs
let game_stop = false
let bomb_count = bombs
let grid = []
const sgrid = ref([])

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

const plantBombsSafe = (safeX, safeY) => {
  let planted = 0
  while (planted < bombs) {
    const x = getRandomInt(col + 1)
    const y = getRandomInt(row + 1)
    const isSafe = Math.abs(x - safeX) <= 1 && Math.abs(y - safeY) <= 1
    if (isSafe || grid[x][y] === 'b') continue
    grid[x][y] = 'b'
    planted++
  }
  lookForBombs()
  placed = true
}

const spreadBomb = () => {
    Array.from({length: bombs}, () => plantBomb())
}

const createGridOf = (value) => {
    return Array.from({length: col+1}, () => Array.from({length: row+1}, () => value))
}

const lookForBombs = () => {
    let bomb = 0
    for (let i = 0; i <= col; i++) {
        for (let j = 0; j <= row; j++) {
            if(grid[i][j] === 'b') {
                continue
            }
            bomb = 0
            for(let k = -1; k <= 1; k++){
                for(let y = -1; y <= 1; y++){
                    if(k === 0 && y === 0){
                        continue;
                    }
                    let x_pixel = i + k
                    let y_pixel = j + y
                    if(x_pixel > -1 && x_pixel <= col && y_pixel > -1 && y_pixel <= row){
                        if(grid[i+k][j+y] === 'b') {
                            bomb++
                        }
                    }
                }
            }
            grid[i][j] = bomb.toString()
        }
    }
}

const gameRules = (x, y) => {
    emit('play')

  if (!placed) plantBombsSafe(x, y)
    if(game_stop === false){
        if(grid[x][y] === 'b'){
            for (let i = 0; i <= col; i++) {
                for (let j = 0; j <= row; j++) {
                    if(grid[i][j] === 'b' && sgrid.value[i][j] === 'n'){
                        sgrid.value[i][j] = 'b'
                    }else if(grid[i][j] !== 'b' && sgrid.value[i][j] === 'f'){
                        sgrid.value[i][j] = 'x'
                    }
                }
            }
            sgrid.value[x][y] = 'bh'
            emit('lose')
            emit('pause')
            game_stop = true
            return
        }else if(grid[x][y] === '0' && sgrid.value[x][y] !== 'f'){
            sgrid.value[x][y] = grid[x][y]
            floodfill(x, y)
        }else if(sgrid.value[x][y] === 'f'){
            bomb_count++
            emit('unflaged')
            sgrid.value[x][y] = grid[x][y]
            gameRules(x, y)
        }else{
            sgrid.value[x][y] = grid[x][y]
        }
        checkIfWon()
    }
}

const floodfill = (x, y) => {
    for(let k = -1; k <= 1; k++){
        for(let j = -1; j <= 1; j++){
            let x_pixel = x + k
            let y_pixel = y + j
            if(x_pixel > -1 && x_pixel <= col && y_pixel > -1 && y_pixel <= row){
                if(grid[x_pixel][y_pixel] !== 'b' && sgrid.value[x_pixel][y_pixel] === 'n'){
                    gameRules(x_pixel, y_pixel)
                }
            }
        }
    }
}

const flag = (x ,y) => {
    emit('play')
    if(sgrid.value[x][y] === 'n' && !game_stop && bomb_count > 0){
        bomb_count--
        sgrid.value[x][y] = 'f'
        emit('flaged')
    }else if(sgrid.value[x][y] === 'f' && !game_stop){
        bomb_count++
        sgrid.value[x][y] = 'n'
        emit('unflaged')
    }
}

const checkIfWon = () => {
    let aux = 0
    for (let i = 0; i <= col; i++) {
        for (let j = 0; j <= row; j++) {
            if(sgrid.value[i][j] === 'n' || sgrid.value[i][j] === 'f'){
                aux++
            }
        }
    }
    if(aux === bombs){
        game_stop = true
        emit('win')
        emit('pause')
        for (let i = 0; i <= col; i++) {
            for (let j = 0; j <= row; j++) {
                if(sgrid.value[i][j] === 'n' && grid[i][j] === 'b'){
                    sgrid.value[i][j] = 'f'
                }
            }
        }
    }
}

const gameInit = () => {
  game_stop = false
  placed = false
  bomb_count = bombs
  sgrid.value = createGridOf('n')
  grid = createGridOf('0')
}

defineExpose({
    gameInit,
})

onMounted(() => {
    gameInit()
})
</script>

<template> 
    <div :style="{ 'grid-template-columns': 'repeat( '+(col+1)+', minmax(0, 1fr))'}" class="minesweeper-grid">
        <div v-for="(column, x_index) in sgrid" :key="x_index" class="minesweeper-grid">
            <div v-for="(state, y_index) in column" :key="y_index" class="minesweeper-grid">
                <Tile @showTile="gameRules" @flag="flag" :tile="state" :x="x_index" :y="y_index"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
img {
    image-rendering: pixelated;
}

.minesweeper-grid {
    display: grid;
    width: fit-content;
    
}
</style>
