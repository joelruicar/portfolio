<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import videoImage from '../assets/video.webp'

const emit = defineEmits<{ finished: [] }>()

const imageSource = `${videoImage}?loading=${Date.now()}`

const animationDuration = 10_560
const zoomDuration = 2_200
const fadeStart = 1_500
const fadeDuration = 800

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

  transitionTimers.push(setTimeout(() => (fading.value = true), fadeStart))
  transitionTimers.push(setTimeout(() => emit('finished'), fadeStart + fadeDuration))
}

onMounted(() => {
  autoStartTimer = setTimeout(startTransition, animationDuration)
})

onUnmounted(() => {
  if (autoStartTimer !== undefined) clearTimeout(autoStartTimer)
  transitionTimers.forEach(clearTimeout)
})
</script>

<<template>
  <div class="overlay" :class="{ fading }" :style="{ '--fade': fadeDuration + 'ms' }">
    <button
      v-if="!zooming"
      class="bttn"
      type="button"
      @click="startTransition"
    >
      Skip
    </button>

    <section id="center" class="viewport">
      <div
        class="stage"
        :class="{ zooming }"
        :style="{ '--zoom': zoomDuration + 'ms' }"
      >
        <picture>
          <source :srcset="imageSource" type="image/webp">
          <img :src="imageSource" alt="Cargando">
        </picture>
      </div>
    </section>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
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
  transition: transform var(--zoom) cubic-bezier(0.55, 0, 0.85, 0.35);
  will-change: transform;
}
.stage.zooming {
  transform: scale(5);
}

.stage img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>