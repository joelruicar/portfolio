<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import videoImage from '../assets/video.webp'
import lastFrameImage from '../assets/video.png'

const emit = defineEmits<{ finished: [] }>()

const imageSource = ref(`${videoImage}?loading=${Date.now()}`)

// precarga el PNG para que el cambio no parpadee
const preload = new Image()
preload.src = lastFrameImage

const animationDuration = 10_560
const zoomDuration = 2_200
const fadeStart = 1_500
const fadeDuration = 800

const drifting = ref(false)
const zooming = ref(false)
const fading = ref(false)

let autoStartTimer: ReturnType<typeof setTimeout> | undefined
const transitionTimers: ReturnType<typeof setTimeout>[] = []

function startTransition() {
  if (zooming.value) return
  zooming.value = true

  if (autoStartTimer !== undefined) {
    clearTimeout(autoStartTimer)
    autoStartTimer = undefined
  }

  // congela en el último fotograma antes del zoom fuerte
  imageSource.value = lastFrameImage

  transitionTimers.push(setTimeout(() => (fading.value = true), fadeStart))
  transitionTimers.push(setTimeout(() => emit('finished'), fadeStart + fadeDuration))
}

onMounted(() => {
  autoStartTimer = setTimeout(startTransition, animationDuration)

  // dos frames para que la transición parta de scale(1)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => (drifting.value = true))
  })
})

onUnmounted(() => {
  if (autoStartTimer !== undefined) clearTimeout(autoStartTimer)
  transitionTimers.forEach(clearTimeout)
})
</script>

<template>
  <div class="overlay" :class="{ fading }" :style="{ '--fade': fadeDuration + 'ms' }">
    <button v-if="!zooming" class="bttn" type="button" @click="startTransition">
      Skip
    </button>

    <section id="center" class="viewport">
      <div
        class="stage"
        :class="{ drifting, zooming }"
        :style="{
          '--zoom': zoomDuration + 'ms',
          '--drift': animationDuration + 'ms',
        }"
      >
        <img :src="imageSource" alt="Cargando">
      </div>
    </section>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #000;
  overflow: hidden;
  opacity: 1;
  transition: opacity var(--fade) ease-in-out;
}
.overlay.fading {
  opacity: 0;
  pointer-events: none;
}

.bttn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
}

.viewport {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.stage {
  width: min(100vw, calc(100vh * 959 / 535));
  aspect-ratio: 959 / 535;
  transform-origin: 50.8% 40.7%;
  transform: scale(1);
  will-change: transform;
}

/* fase 1: zoom lento durante la espera */
.stage.drifting {
  transform: scale(1.08);
  transition: transform var(--drift) linear;
}

/* fase 2: zoom fuerte (va después, así que gana a .drifting) */
.stage.zooming {
  transform: scale(5);
  transition: transform var(--zoom) cubic-bezier(0.3, 0, 0.8, 0.2);
}

.stage img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>