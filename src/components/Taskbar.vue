<!-- Taskbar.vue -->
<script setup lang="ts">
// import { useWindowsStore } from '@/stores/windows'
// import StartButton from './StartButton.vue'
// import StartMenu from './StartMenu.vue'
// import TaskbarItem from './TaskbarItem.vue'

// const store = useWindowsStore()
// const menuOpen = ref(false)

import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('')
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
  z-index: 9999; /* por encima de todas las ventanas */
}
.taskbar__items { display: flex; gap: 2px; flex: 1; }
.tray {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 100%;
  border: 1px solid;
  border-color: #808080 #fff #fff #808080; /* borde hundido */
}
.tray {
  margin-left: auto;
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
</style>