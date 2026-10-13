<script setup lang="ts">
import { useI18n } from '../../i18n'
import contactIcon from '../../assets/contact.ico'

const { messages } = useI18n()
</script>

<template>
  <div class="cv-window">
    <!-- Top Win95 Title & Toolbar Banner -->
    <header class="cv-header">
      <div class="cv-header__main">
        <img :src="contactIcon" alt="Experiencia" class="cv-header__icon" />
        <div class="cv-header__titles">
          <h2 class="cv-header__title">{{ messages.cv.headerTitle }}</h2>
          <p class="cv-header__subtitle">{{ messages.cv.headerSubtitle }}</p>
        </div>
      </div>

      <div class="cv-header__actions">
        <a
          href="/resume.pdf"
          download="Joel_Ruiz_CV.pdf"
          class="retro-btn retro-btn--primary"
          title="Descargar archivo resume.pdf"
        >
          {{ messages.cv.downloadPdfBtn }}
        </a>
      </div>
    </header>

    <!-- Main Experience Cards Panel -->
    <main class="cv-content-panel">
      <div class="cv-cards-list">
        <article
          v-for="(exp, idx) in messages.cv.experience"
          :key="idx"
          class="cv-card"
        >
          <div class="cv-card__header">
            <div class="cv-card__title-group">
              <h3 class="cv-card__company">{{ exp.company }}</h3>
              <div class="cv-card__role">{{ exp.role }}</div>
            </div>
            <div class="cv-card__meta">
              <span class="cv-badge cv-badge--date">{{ exp.period }}</span>
              <span class="cv-badge cv-badge--location">{{ exp.location }}</span>
            </div>
          </div>

          <ul class="cv-card__bullets">
            <li v-for="(b, bIdx) in exp.bullets" :key="bIdx">
              {{ b }}
            </li>
          </ul>

          <div v-if="exp.tech && exp.tech.length" class="cv-card__tech">
            <span class="cv-tech-label">Stack:</span>
            <div class="cv-tech-list">
              <span v-for="t in exp.tech" :key="t" class="cv-tech-chip">
                {{ t }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cv-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background: #c0c0c0;
  color: #000;
  font-family: 'MS Sans Serif', Tahoma, 'Segoe UI', Arial, sans-serif;
  overflow: hidden;
  user-select: text;
}

/* Header */
.cv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  background: #c0c0c0;
  border-bottom: 2px groove #dfdfdf;
  flex-wrap: wrap;
}

.cv-header__main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cv-header__icon {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  flex-shrink: 0;
}

.cv-header__titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cv-header__title {
  margin: 0;
  font-size: 15px;
  font-weight: bold;
  color: #000080;
  letter-spacing: 0.5px;
}

.cv-header__subtitle {
  margin: 0;
  font-size: 12px;
  color: #404040;
}

.cv-header__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

/* Content Panel */
.cv-content-panel {
  flex: 1;
  min-height: 0;
  background: #ffffff;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  margin: 8px;
  padding: 12px;
  overflow-y: auto;
  box-shadow: inset 1px 1px 0 #000;
  position: relative;
  z-index: 1;
}

.cv-content-panel::-webkit-scrollbar {
  width: 16px;
}

.cv-content-panel::-webkit-scrollbar-track {
  background: #dfdfdf;
}

.cv-content-panel::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
}

/* Cards */
.cv-cards-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cv-card {
  background: #fbfbfb;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  padding: 10px 12px;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.15);
}

.cv-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  border-bottom: 1px dashed #c0c0c0;
  padding-bottom: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.cv-card__title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cv-card__company {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #000080;
}

.cv-card__role {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}

.cv-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.cv-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  font-size: 11px;
  font-family: inherit;
  background: #e4e4e4;
  border: 1px solid #808080;
  border-radius: 2px;
  white-space: nowrap;
}

.cv-badge--date {
  background: #eef3ff;
  border-color: #7b96db;
  color: #000080;
  font-weight: bold;
}

.cv-badge--location {
  background: #f5f5f5;
  color: #404040;
}

/* Bullets */
.cv-card__bullets {
  margin: 0 0 10px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12.5px;
  line-height: 1.5;
  color: #222;
}

.cv-card__bullets li {
  list-style-type: square;
}

/* Tech Chips */
.cv-card__tech {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 6px;
  border-top: 1px dotted #dfdfdf;
  flex-wrap: wrap;
}

.cv-tech-label {
  font-size: 11px;
  font-weight: bold;
  color: #555;
  text-transform: uppercase;
}

.cv-tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.cv-tech-chip {
  padding: 1px 6px;
  background: #ececec;
  border: 1px solid;
  border-color: #808080 #fff #fff #808080;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #000080;
  font-weight: bold;
}

/* Retro Buttons */
.retro-btn {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  color: #000;
  text-decoration: none;
  font-family: inherit;
  font-size: 12px;
  box-shadow: 1px 1px 0 #000;
  cursor: pointer;
  white-space: nowrap;
}

.retro-btn:active {
  border-color: #404040 #fff #fff #404040;
  box-shadow: none;
  transform: translate(1px, 1px);
}

.retro-btn--primary {
  font-weight: bold;
  background: #000080;
  color: #ffffff;
  border-color: #6386ea #000038 #000038 #6386ea;
  box-shadow: 1px 1px 0 #000;
  letter-spacing: 0.3px;
}

.retro-btn--primary:hover {
  background: #0010a0;
  color: #ffffff;
}

.retro-btn--primary:active {
  border-color: #000038 #6386ea #6386ea #000038;
  background: #000068;
  box-shadow: none;
  transform: translate(1px, 1px);
}

/* Responsive adjustments */
@media (max-width: 699px) {
  .cv-header {
    flex-direction: column;
    align-items: stretch;
  }

  .cv-header__actions {
    width: 100%;
  }

  .cv-header__actions .retro-btn {
    width: 100%;
    justify-content: center;
  }

  .cv-card__header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
