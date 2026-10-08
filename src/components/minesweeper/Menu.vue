<script setup>
import { ref } from 'vue';

const emit = defineEmits(['dif', 'newgame'])

const selected = ref('')

const difficulty = (dif) => {
	switch(dif){
		case 'hard':
            selected.value = 'hard'
            emit('dif', 'hard')
			break
		case 'inter':
            selected.value = 'inter'
            emit('dif', 'inter')
			break
		default:
            selected.value = ''
            emit('dif', '')
	}

}

</script>

<template>
    <div class="minesweeper-menu">
        <div id="menu" class="minesweeper-menu__content">
            <div id="new-game" class="minesweeper-menu__item minesweeper-menu__item--highlight">
                <div @click="emit('newgame')" class="minesweeper-menu__row minesweeper-menu__row--between">
                    <p class="minesweeper-menu__label">New</p>
                    <p class="minesweeper-menu__shortcut">F2</p>
                </div>
            </div>
            <div class="minesweeper-menu__separator">
                <div class="border-b border-dark-gray-win"></div>
                <div class="border-b border-white"></div>
            </div>
            <div id="begginer-difficulty" @click="difficulty('')" class="minesweeper-menu__item">
                <div class="minesweeper-menu__row">
                    <div class="minesweeper-menu__check">
                        <img v-if="selected === ''" src="../../assets/minesweeper/img/select.png" alt="">
                    </div>
                    <p class="minesweeper-menu__label">Beginner</p>
                </div>
            </div>
            <div id="intermediate-difficulty" @click="difficulty('inter')" class="minesweeper-menu__item">
                <div class="minesweeper-menu__row">
                    <div class="minesweeper-menu__check">
                        <img v-if="selected === 'inter'" src="../../assets/minesweeper/img/select.png" alt="">
                    </div>
                    <p class="minesweeper-menu__label">Intermediate</p>
                </div>
            </div>
            <div id="hard-difficulty" @click="difficulty('hard')" class="minesweeper-menu__item">
                <div class="minesweeper-menu__row">
                    <div class="minesweeper-menu__check">
                        <img v-if="selected === 'hard'" src="../../assets/minesweeper/img/select.png" alt="">
                    </div>
                    <p class="minesweeper-menu__label">Expert</p>
                </div>
            </div>
            <div id="custom-grid" class="minesweeper-menu__item minesweeper-menu__item--highlight">
                <p class="minesweeper-menu__label">Custom...</p>
            </div>
            <div class="minesweeper-menu__separator">
                <div class="border-b border-dark-gray-win"></div>
                <div class="border-b border-white"></div>
            </div>
            <div id="marks" class="minesweeper-menu__item">
                <div class="minesweeper-menu__row">  
                    <p class="minesweeper-menu__label">Marks (?)</p>
                </div>
            </div>
            <div id="colors" class="minesweeper-menu__item">
                <div class="minesweeper-menu__row">  
                    <div class="minesweeper-menu__check">
                        <img src="../../assets/minesweeper/img/select.png" alt="">
                    </div>
                    <p class="minesweeper-menu__label">Color</p>
                </div>
            </div>
            <div class="minesweeper-menu__separator">
                <div class="border-b border-dark-gray-win"></div>
                <div class="border-b border-white"></div>
            </div>
            <div id="best-times" class="minesweeper-menu__item minesweeper-menu__item--highlight">
                <p class="minesweeper-menu__label">Best Times...</p>
            </div>
            <div class="minesweeper-menu__separator">
                <div class="border-b border-dark-gray-win"></div>
                <div class="border-b border-white"></div>
            </div>
            <div id="exit" class="minesweeper-menu__item minesweeper-menu__item--highlight">
                <p class="minesweeper-menu__label">Exit</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.minesweeper-menu {
    position: absolute;
    top: 21px;
    left: 2px;
    z-index: 10;
    width: 147px;
    padding: 1px;
    color: #000;
    background: #c3c3c3;
    box-shadow: -1px -1px #fff, 1px 1px #818181, 2px 2px #000;
    font: 12px/1.2 'w95fa', sans-serif;
}

.minesweeper-menu__content {
    display: flex;
    flex-direction: column;
}

.minesweeper-menu__item {
    cursor: default;
}

.minesweeper-menu__item--highlight:hover {
    color: #fff;
    background: #010081;
}

.minesweeper-menu__row {
    display: flex;
    min-height: 18px;
    align-items: center;
}

.minesweeper-menu__row--between {
    justify-content: space-between;
}

.minesweeper-menu__label {
    margin: 0;
    padding: 2px 0;
}

.minesweeper-menu__item--highlight .minesweeper-menu__label {
    margin-left: 21px;
}

.minesweeper-menu__shortcut {
    margin: 0 23px 0 0;
    padding: 2px 0;
}

.minesweeper-menu__check {
    display: flex;
    width: 21px;
    justify-content: center;
}

.minesweeper-menu__check img {
    width: 7px;
    height: 7px;
}

.minesweeper-menu__separator {
    height: 4px;
    margin: 2px 1px;
    border-top: 1px solid #818181;
    border-bottom: 1px solid #fff;
}
</style>