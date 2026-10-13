<script setup lang="ts">
import { useI18n } from '../../i18n'
import gitIcon from '../../assets/git.ico'
import linkedIcon from '../../assets/linked.ico'

const { messages } = useI18n()

const socials = [
  {
    name: 'GitHub',
    handle: '@joelruicar',
    url: 'https://github.com/joelruicar',
    icon: gitIcon,
  },
  {
    name: 'LinkedIn',
    handle: 'Joel Ruiz',
    url: 'https://www.linkedin.com/in/joel-ruiz-bbab68240',
    icon: linkedIcon,
  },
]
</script>

<template>
  <section class="contact-window">
    <h2>{{ messages.contact }}</h2>
    <p>{{ messages.content.contact }}</p>

    <div class="contact-links">
      <a
        v-for="item in socials"
        :key="item.name"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="retro-button"
      >
        <img :src="item.icon" alt="" />
        <span>{{ item.name }}: <strong>{{ item.handle }}</strong></span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.contact-window {
  min-height: 180px;
  padding: 16px;
  color: #000;
  background: #ffffe1;
  border: 1px solid #808080;
  font-family: 'Courier New', monospace;
}

.contact-window h2 {
  margin: 0 0 12px;
  color: #000080;
  font-size: 18px;
}

.contact-window p {
  margin: 0 0 16px;
  line-height: 1.6;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.retro-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  color: #000;
  text-decoration: none;
  font-family: inherit;
  font-size: 14px;
  width: fit-content;
  box-shadow: 1px 1px #000;
  cursor: pointer;
}

.retro-button:active {
  border-color: #404040 #fff #fff #404040;
  box-shadow: none;
  transform: translate(1px, 1px);
}

.retro-button img {
  width: 20px;
  height: 20px;
  image-rendering: pixelated;
}
</style>
