<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n, type ProjectItem } from '../../i18n'
import directoryIcon from '../../assets/directory.ico'
import promptIcon from '../../assets/prompt.ico'
import explorerIcon from '../../assets/explorer.ico'
import gitIcon from '../../assets/git.ico'
import windowsLogo from '../../assets/windowslogo.png'
import cttIcon from '../../assets/CTT.ico'
import frigleamIcon from '../../assets/frigleam.ico'
import cttImg from '../../assets/CTT.png'
import frigleamImg from '../../assets/frigleam.png'
import deskImg from '../../assets/desk.jpg'
import ollamaImg from '../../assets/ollama.png'

const emit = defineEmits<{
  close: []
}>()

const { messages } = useI18n()

// Selected project ID (defaults to 'ctt')
const selectedProjectId = ref<string>('ctt')

// Dialog state (About Explorer)
const showAboutDialog = ref(false)

// Menubar state
type ProjectsMenuKey = 'file' | 'edit' | 'view' | 'help'
const activeMenu = ref<ProjectsMenuKey | null>(null)

// Project icons map
const projectIcons: Record<string, string> = {
  ctt: cttIcon,
  frigleam: frigleamIcon,
  portfolio: explorerIcon,
  ollama: promptIcon,
}

// Project images map
const projectImages: Record<string, string | null> = {
  ctt: cttImg,
  frigleam: frigleamImg,
  portfolio: deskImg,
  ollama: ollamaImg,
}

// Current projects list from i18n
const projects = computed<ProjectItem[]>(() => messages.value.projectsApp.items)

// Currently selected project item
const selectedProject = computed<ProjectItem>(() => {
  return (
    projects.value.find((p) => p.id === selectedProjectId.value) ||
    projects.value[0]
  )
})

function selectProject(id: string) {
  selectedProjectId.value = id
}

function handleOpenProject(project: ProjectItem) {
  if (project.liveUrl && project.liveUrl !== '#') {
    window.open(project.liveUrl, '_blank', 'noopener,noreferrer')
  } else if (project.githubUrl) {
    window.open(project.githubUrl, '_blank', 'noopener,noreferrer')
  }
}

function toggleMenu(menu: ProjectsMenuKey) {
  activeMenu.value = activeMenu.value === menu ? null : menu
}

function onMenuHover(menu: ProjectsMenuKey) {
  if (activeMenu.value !== null) {
    activeMenu.value = menu
  }
}

function closeAllMenus() {
  activeMenu.value = null
}

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {})
  }
}

function handleOpenSelected() {
  handleOpenProject(selectedProject.value)
  closeAllMenus()
}

function handleCopyLiveUrl() {
  if (selectedProject.value.liveUrl && selectedProject.value.liveUrl !== '#') {
    copyToClipboard(selectedProject.value.liveUrl)
  }
  closeAllMenus()
}

function handleCopyGithubUrl() {
  copyToClipboard(selectedProject.value.githubUrl)
  closeAllMenus()
}

function handleShowAbout() {
  showAboutDialog.value = true
  closeAllMenus()
}

function onWindowPointerDown(e: PointerEvent) {
  const target = e.target as HTMLElement | null
  if (!target?.closest('.projects-menubar')) {
    closeAllMenus()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onWindowPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onWindowPointerDown)
})
</script>

<template>
  <div class="projects-explorer" @contextmenu.prevent>
    <!-- 1. Menubar -->
    <header class="projects-menubar">
      <!-- File Menu -->
      <div
        class="projects-menu"
        :class="{ 'projects-menu--open': activeMenu === 'file' }"
      >
        <button
          type="button"
          class="projects-menu__trigger"
          @pointerdown.stop="toggleMenu('file')"
          @mouseenter="onMenuHover('file')"
        >
          <u>{{ messages.projectsApp.menu.file[0] }}</u
          >{{ messages.projectsApp.menu.file.slice(1) }}
        </button>
        <div v-if="activeMenu === 'file'" class="projects-dropdown">
          <button type="button" @click="handleOpenSelected">
            <span class="projects-menu-label">{{
              messages.projectsApp.menu.open
            }}</span>
            <span class="shortcut">Enter</span>
          </button>
          <hr class="projects-menu-hr" />
          <button type="button" @click="emit('close')">
            <span class="projects-menu-label">{{
              messages.projectsApp.menu.exit
            }}</span>
          </button>
        </div>
      </div>

      <!-- Edit Menu -->
      <div
        class="projects-menu"
        :class="{ 'projects-menu--open': activeMenu === 'edit' }"
      >
        <button
          type="button"
          class="projects-menu__trigger"
          @pointerdown.stop="toggleMenu('edit')"
          @mouseenter="onMenuHover('edit')"
        >
          <u>{{ messages.projectsApp.menu.edit[0] }}</u
          >{{ messages.projectsApp.menu.edit.slice(1) }}
        </button>
        <div v-if="activeMenu === 'edit'" class="projects-dropdown">
          <button
            type="button"
            :disabled="
              !selectedProject.liveUrl || selectedProject.liveUrl === '#'
            "
            @click="handleCopyLiveUrl"
          >
            <span class="projects-menu-label">Copiar enlace Demo</span>
          </button>
          <button type="button" @click="handleCopyGithubUrl">
            <span class="projects-menu-label">Copiar URL GitHub</span>
          </button>
        </div>
      </div>

      <!-- View Menu -->
      <div
        class="projects-menu"
        :class="{ 'projects-menu--open': activeMenu === 'view' }"
      >
        <button
          type="button"
          class="projects-menu__trigger"
          @pointerdown.stop="toggleMenu('view')"
          @mouseenter="onMenuHover('view')"
        >
          <u>{{ messages.projectsApp.menu.view[0] }}</u
          >{{ messages.projectsApp.menu.view.slice(1) }}
        </button>
        <div v-if="activeMenu === 'view'" class="projects-dropdown">
          <button type="button" @click="closeAllMenus">
            <span class="projects-menu-label">{{
              messages.projectsApp.menu.refresh
            }}</span>
            <span class="shortcut">F5</span>
          </button>
        </div>
      </div>

      <!-- Help Menu -->
      <div
        class="projects-menu"
        :class="{ 'projects-menu--open': activeMenu === 'help' }"
      >
        <button
          type="button"
          class="projects-menu__trigger"
          @pointerdown.stop="toggleMenu('help')"
          @mouseenter="onMenuHover('help')"
        >
          <u>{{ messages.projectsApp.menu.help[0] }}</u
          >{{ messages.projectsApp.menu.help.slice(1) }}
        </button>
        <div v-if="activeMenu === 'help'" class="projects-dropdown">
          <button type="button" @click="handleShowAbout">
            <span class="projects-menu-label">{{
              messages.projectsApp.menu.aboutExplorer
            }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 2. Toolbar -->
    <section class="projects-toolbar">
      <div class="toolbar-nav-group">
        <button type="button" class="retro-tool-btn" title="Atrás" disabled>
          <span class="tool-arrow">⇦</span>
          <span class="tool-text">{{ messages.projectsApp.toolbar.back }}</span>
        </button>
        <button type="button" class="retro-tool-btn" title="Adelante" disabled>
          <span class="tool-arrow">⇨</span>
          <span class="tool-text">{{
            messages.projectsApp.toolbar.forward
          }}</span>
        </button>
        <button
          type="button"
          class="retro-tool-btn"
          title="Subir nivel"
        ></button>
      </div>

      <div class="toolbar-sep" />
    </section>

    <!-- 3. Address Bar -->
    <div class="projects-address-bar">
      <span class="address-label">Dirección:</span>
      <div class="address-input-box">
        <img :src="directoryIcon" alt="Folder" class="address-icon" />
        <span class="address-path">{{ messages.projectsApp.headerPath }}</span>
      </div>
    </div>

    <!-- 4. Main Explorer Workspace (Split View) -->
    <main class="projects-workspace">
      <!-- Left: File / Project List Pane -->
      <section class="projects-file-pane">
        <div class="icons-grid">
          <div
            v-for="proj in projects"
            :key="proj.id"
            class="project-item-card"
            :class="{
              'project-item-card--selected': selectedProjectId === proj.id,
            }"
            tabindex="0"
            @click="selectProject(proj.id)"
            @dblclick="handleOpenProject(proj)"
            @keydown.enter="handleOpenProject(proj)"
          >
            <div class="item-icon-wrapper">
              <img
                :src="projectIcons[proj.id] || directoryIcon"
                :alt="proj.title"
                class="item-icon-img"
              />
            </div>
            <div class="item-label-text">{{ proj.title }}</div>
          </div>
        </div>
      </section>

      <!-- Right: Inspector / Preview Pane -->
      <section class="projects-inspector-pane">
        <div class="inspector-header">
          <div class="inspector-title-row">
            <img
              :src="projectIcons[selectedProject.id] || directoryIcon"
              alt=""
              class="inspector-title-icon"
            />
            <h3 class="inspector-title">{{ selectedProject.title }}</h3>
          </div>
          <div class="inspector-category">{{ selectedProject.category }}</div>
        </div>

        <!-- Preview Graphic Container -->
        <div class="inspector-preview-box">
          <!-- Real Image Preview -->
          <div
            v-if="projectImages[selectedProject.id]"
            class="image-preview-wrapper"
          >
            <img
              :src="projectImages[selectedProject.id]!"
              :alt="selectedProject.title"
              class="project-preview-img"
            />
          </div>

          <!-- Fallback Graphic -->
          <div v-else class="generic-placeholder">
            <img :src="directoryIcon" alt="" class="generic-icon" />
            <span>Vista previa del proyecto</span>
          </div>
        </div>

        <!-- Description -->
        <div class="inspector-body">
          <p class="inspector-desc">{{ selectedProject.fullDesc }}</p>

          <!-- Key Highlights -->
          <div class="inspector-highlights">
            <div class="highlights-heading">
              Aspectos destacados & arquitectura:
            </div>
            <ul class="highlights-list">
              <li v-for="(hl, hIdx) in selectedProject.highlights" :key="hIdx">
                {{ hl }}
              </li>
            </ul>
          </div>

          <!-- Tech Stack Chips -->
          <div class="inspector-tech-section">
            <span class="tech-label">Stack tecnológico:</span>
            <div class="tech-chips-list">
              <span
                v-for="t in selectedProject.tech"
                :key="t"
                class="tech-chip"
              >
                {{ t }}
              </span>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="inspector-actions-bar">
            <!-- Live Demo Button -->
            <a
              v-if="selectedProject.liveUrl && selectedProject.liveUrl !== '#'"
              :href="selectedProject.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="retro-btn retro-btn--primary"
            >
              {{ messages.projectsApp.actions.liveDemo }}
            </a>

            <!-- Portfolio Self Note -->
            <span
              v-else-if="selectedProject.id === 'portfolio'"
              class="retro-btn retro-btn--disabled"
              title="¡Estás explorando este proyecto en este momento!"
            >
              ★ {{ selectedProject.title }}
            </span>

            <!-- Ollama Local Badge -->
            <span
              v-else-if="selectedProject.isLocalOnly"
              class="retro-btn retro-btn--local"
              title="Este proyecto se ejecuta en localhost comunicándose con Ollama"
            >
              💻 {{ messages.projectsApp.actions.localBadge }}
            </span>

            <!-- GitHub Code Button -->
            <a
              :href="selectedProject.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="retro-btn"
            >
              <img :src="gitIcon" alt="" class="btn-git-icon" />
              {{ messages.projectsApp.actions.githubRepo }}
            </a>
          </div>
        </div>
      </section>
    </main>

    <!-- 5. Status Bar -->
    <footer class="projects-statusbar">
      <div class="status-cell status-cell--count">
        {{ messages.projectsApp.status.itemsCount }}
      </div>
      <div class="status-cell status-cell--selected">
        1 seleccionado ({{ selectedProject.fileSize }})
      </div>
      <div class="status-cell status-cell--fs">
        {{ messages.projectsApp.status.fileSystem }}
      </div>
    </footer>

    <!-- 6. Retro Dialog: About Explorer -->
    <div
      v-if="showAboutDialog"
      class="projects-modal-backdrop"
      @click="showAboutDialog = false"
    >
      <div class="retro-dialog about-dialog" @click.stop>
        <div class="retro-dialog__titlebar">
          <div class="retro-dialog__title">
            {{ messages.projectsApp.aboutDialog.title }}
          </div>
          <button
            type="button"
            class="retro-dialog__close"
            @click="showAboutDialog = false"
          >
            ×
          </button>
        </div>
        <div class="retro-dialog__body about-dialog__body">
          <div class="about-header-row">
            <img :src="windowsLogo" alt="Windows 95" class="about-win-logo" />
            <div class="about-titles">
              <h3>{{ messages.projectsApp.aboutDialog.heading }}</h3>
              <p class="about-sub">
                {{ messages.projectsApp.aboutDialog.subheading }}
              </p>
            </div>
          </div>
          <hr class="retro-hr" />
          <div class="about-details">
            <p>
              <strong>{{ messages.projectsApp.aboutDialog.dev }}</strong>
            </p>
            <p>{{ messages.projectsApp.aboutDialog.version }}</p>
            <p class="stats-line">Sistema de archivos: FAT32 Proyectos Web</p>
            <p class="stats-line">4 proyectos cargados con éxito en memoria.</p>
          </div>
          <div class="dialog-actions-row">
            <button
              type="button"
              class="retro-btn retro-btn--primary"
              @click="showAboutDialog = false"
            >
              {{ messages.projectsApp.aboutDialog.okBtn }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-explorer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  box-sizing: border-box;
  background: #c0c0c0;
  color: #000;
  font-family: 'MS Sans Serif', Tahoma, 'Segoe UI', Arial, sans-serif;
  user-select: none;
  overflow: hidden;
  position: relative;
}

/* -------------------------------------------------------------
   Menubar
------------------------------------------------------------- */
.projects-menubar {
  display: flex;
  align-items: center;
  height: 22px;
  min-height: 22px;
  background: #c0c0c0;
  padding: 1px 2px;
  box-sizing: border-box;
  font-size: 11px;
  border-bottom: 1px solid #808080;
}

.projects-menu {
  position: relative;
}

.projects-menu__trigger {
  height: 19px;
  line-height: 17px;
  padding: 0 6px;
  border: 1px solid transparent;
  background: transparent;
  color: #000;
  font-family: inherit;
  font-size: 11px;
  cursor: default;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.projects-menu__trigger:hover,
.projects-menu--open .projects-menu__trigger {
  background: #000080;
  color: #ffffff;
}

.projects-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
  padding: 2px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
}

.projects-dropdown button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 3px 8px;
  border: none;
  background: transparent;
  color: #000;
  font-family: inherit;
  font-size: 11px;
  text-align: left;
  cursor: default;
  white-space: nowrap;
}

.projects-dropdown button:hover:not(:disabled) {
  background: #000080;
  color: #fff;
}

.projects-dropdown button:disabled {
  color: #808080;
  text-shadow: 1px 1px 0 #fff;
  cursor: default;
}

.projects-dropdown .shortcut {
  margin-left: 20px;
  font-size: 10px;
  opacity: 0.8;
}

.projects-menu-hr {
  margin: 3px 2px;
  border: none;
  border-top: 1px solid #808080;
  border-bottom: 1px solid #fff;
}

/* -------------------------------------------------------------
   Toolbar
------------------------------------------------------------- */
.projects-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 6px;
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.toolbar-nav-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-sep {
  width: 2px;
  height: 20px;
  margin: 0 4px;
  border-left: 1px solid #808080;
  border-right: 1px solid #fff;
}

.retro-tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 1px 6px;
  background: #c0c0c0;
  border: 1px solid transparent;
  color: #000;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
}

.retro-tool-btn:hover:not(:disabled) {
  border: 1px solid;
  border-color: #fff #404040 #404040 #fff;
}

.retro-tool-btn:active:not(:disabled) {
  border: 1px solid;
  border-color: #404040 #fff #fff #404040;
  background: #dfdfdf;
}

.retro-tool-btn:disabled {
  color: #808080;
  opacity: 0.6;
  cursor: default;
}

/* -------------------------------------------------------------
   Address Bar
------------------------------------------------------------- */
.projects-address-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;
  background: #c0c0c0;
  border-bottom: 2px groove #dfdfdf;
  font-size: 11px;
}

.address-label {
  color: #404040;
  font-weight: 500;
}

.address-input-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 20px;
  background: #fff;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  box-shadow: inset 1px 1px 0 #000;
  padding: 0 6px;
  font-family: 'Courier New', monospace;
  font-size: 11.5px;
}

.address-icon {
  width: 14px;
  height: 14px;
  image-rendering: pixelated;
}

.address-path {
  color: #000;
}

/* -------------------------------------------------------------
   Workspace (Split View)
------------------------------------------------------------- */
.projects-workspace {
  flex: 1;
  min-height: 0;
  display: flex;
  background: #fff;
  overflow: hidden;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  margin: 4px;
  box-shadow: inset 1px 1px 0 #000;
}

/* Left Pane: Clean Icon Grid */
.projects-file-pane {
  flex: 0 0 38%;
  min-width: 180px;
  max-width: 320px;
  background: #ffffff;
  border-right: 2px solid;
  border-color: #808080 #fff #fff #808080;
  overflow-y: auto;
  padding: 8px;
  box-sizing: border-box;
}

.icons-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-item-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  cursor: pointer;
  background: #fafafa;
  border: 1px solid #e0e0e0;
}

.project-item-card:hover {
  background: #f0f4ff;
  border-color: #8ba5d8;
}

.project-item-card--selected {
  background: #000080 !important;
  color: #ffffff !important;
  border: 1px dotted #ffffff;
}

.item-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.item-icon-img {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
}

.item-label-text {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

/* Right Pane: Inspector */
.projects-inspector-pane {
  flex: 1;
  min-width: 0;
  background: #f7f7f7;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  user-select: text;
}

.inspector-header {
  border-bottom: 2px groove #dfdfdf;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.inspector-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inspector-title-icon {
  width: 22px;
  height: 22px;
  image-rendering: pixelated;
  flex-shrink: 0;
}

.inspector-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #000080;
}

.inspector-category {
  font-size: 11.5px;
  color: #555;
}

/* Visual Preview Box */
.inspector-preview-box {
  background: #ffffff;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  box-shadow: inset 1px 1px 0 #000;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  max-height: 280px;
  overflow: hidden;
}

.image-preview-wrapper {
  width: 100%;
  height: 100%;
  max-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #ececec;
}

.project-preview-img {
  max-width: 100%;
  max-height: 260px;
  object-fit: contain;
  display: block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.generic-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #777;
  font-size: 12px;
}

.generic-icon {
  width: 32px;
  height: 32px;
}

/* Description & Content */
.inspector-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.inspector-desc {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: #1a1a1a;
}

.inspector-highlights {
  background: #fbfbfb;
  border: 1px solid #dcdcdc;
  padding: 8px 10px;
}

.highlights-heading {
  font-size: 11px;
  font-weight: bold;
  color: #000080;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.highlights-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  line-height: 1.45;
  color: #333;
}

.highlights-list li {
  list-style-type: square;
}

/* Tech Chips */
.inspector-tech-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tech-label {
  font-size: 11px;
  font-weight: bold;
  color: #404040;
  text-transform: uppercase;
}

.tech-chips-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tech-chip {
  padding: 1px 6px;
  background: #ececec;
  border: 1px solid;
  border-color: #808080 #fff #fff #808080;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #000080;
  font-weight: bold;
}

/* Action Buttons Bar */
.inspector-actions-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 6px;
  border-top: 1px dashed #d0d0d0;
  flex-wrap: wrap;
}

.retro-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  color: #000;
  text-decoration: none;
  font-family: inherit;
  font-size: 11.5px;
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
}

.retro-btn--primary:hover {
  background: #0010a0;
  color: #ffffff;
}

.retro-btn--disabled {
  background: #e0e0e0;
  color: #555;
  border-color: #808080;
  box-shadow: none;
  cursor: default;
}

.retro-btn--local {
  background: #eef7ee;
  color: #065f46;
  border-color: #6ee7b7 #047857 #047857 #6ee7b7;
  font-weight: 600;
}

.btn-git-icon {
  width: 14px;
  height: 14px;
  image-rendering: pixelated;
}

/* -------------------------------------------------------------
   Status Bar
------------------------------------------------------------- */
.projects-statusbar {
  display: flex;
  align-items: center;
  height: 22px;
  background: #c0c0c0;
  border-top: 1px solid #808080;
  padding: 2px 4px;
  box-sizing: border-box;
  font-size: 11px;
  gap: 4px;
}

.status-cell {
  padding: 1px 6px;
  border: 1px solid;
  border-color: #808080 #fff #fff #808080;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-cell--count {
  min-width: 90px;
}

.status-cell--selected {
  flex: 1;
}

.status-cell--fs {
  min-width: 120px;
}

/* -------------------------------------------------------------
   Retro Dialog: About Explorer
------------------------------------------------------------- */
.projects-modal-backdrop {
  position: absolute;
  inset: 0;
  z-index: 5000;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.retro-dialog {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;
  box-shadow: 2px 2px 0 #000;
  color: #000;
  font-family: 'MS Sans Serif', Tahoma, sans-serif;
  user-select: none;
}

.about-dialog {
  width: 360px;
  max-width: 92vw;
}

.retro-dialog__titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
  background: #000080;
  color: #fff;
  font-size: 11.5px;
  font-weight: bold;
}

.retro-dialog__close {
  width: 16px;
  height: 16px;
  line-height: 12px;
  padding: 0;
  background: #c0c0c0;
  border: 1px solid;
  border-color: #fff #404040 #404040 #fff;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
}

.retro-dialog__body {
  padding: 10px;
  font-size: 11.5px;
}

.retro-hr {
  margin: 6px 0;
  border: none;
  border-top: 1px solid #808080;
  border-bottom: 1px solid #fff;
}

.dialog-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 10px;
}

.about-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.about-win-logo {
  width: 48px;
  height: auto;
  image-rendering: pixelated;
}

.about-titles h3 {
  margin: 0;
  font-size: 13px;
  font-weight: bold;
  color: #000080;
}

.about-sub {
  margin: 2px 0 0;
  font-size: 11px;
  color: #555;
}

.about-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11.5px;
}

.about-details p {
  margin: 0;
}

.stats-line {
  color: #555;
  font-size: 10.5px;
}

/* -------------------------------------------------------------
   Responsive Mobile Adjustments
------------------------------------------------------------- */
@media (max-width: 699px) {
  .projects-workspace {
    flex-direction: column;
  }

  .projects-file-pane {
    flex: 0 0 auto;
    max-width: none;
    border-right: none;
    border-bottom: 2px solid;
    border-color: #808080 #fff #fff #808080;
    max-height: 140px;
  }

  .icons-grid {
    flex-direction: row;
    overflow-x: auto;
    gap: 6px;
  }

  .project-item-card {
    min-width: 130px;
    padding: 4px 6px;
  }

  .projects-inspector-pane {
    padding: 8px 10px;
  }

  .inspector-preview-box {
    min-height: 130px;
    max-height: 190px;
  }

  .inspector-actions-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .inspector-actions-bar .retro-btn {
    justify-content: center;
  }
}
</style>
