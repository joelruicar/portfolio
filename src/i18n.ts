import { computed, ref } from 'vue'

export const locales = ['es', 'en', 'de'] as const
export type Locale = (typeof locales)[number]

type Translation = {
  about: string
  contact: string
  projects: string
  skills: string
  minesweeper: string
  language: string
  languageNames: Record<Locale, string>
  run:string
  startMenu: {
    mines: string
    run: string
    linked: string
    git: string
  }
  content: {
    about: string
    contact: string
    projects: string
  }
  file: string
  edit: string
  view: string
  socials: string
}

const translations: Record<Locale, Translation> = {
  es: {
    about: 'Sobre mí',
    contact: 'CV',
    projects: 'Proyectos',
    skills: 'Habilidades',
    minesweeper: 'Buscaminas',
    run: 'CMD',
    language: 'Idioma',
    languageNames: { es: 'ES', en: 'EN', de: 'DE' },
    startMenu: {
      mines: 'Buscaminas',
      run: 'CMD',
      linked: 'LinkedIn',
      git: 'Github',
    },
    file: 'Fichero',
    edit: 'Editar',
    view: 'Ver',
    content: {
      about: 'Aquí puedes contar quién eres y cuál es tu experiencia.',
      contact: 'Aquí puedes añadir tus datos de contacto y tus redes.',
      projects: 'Aquí puedes mostrar tus proyectos y trabajos destacados.',
    },
    socials: 'Redes sociales'
  },
  en: {
    about: 'About me',
    contact: 'CV',
    projects: 'Projects',
    run: 'CMD',
    skills: 'Skills',
    minesweeper: 'Minesweeper',
    language: 'Language',
    languageNames: { es: 'ES', en: 'EN', de: 'DE' },
    startMenu: {
      mines: 'Minesweeper',
      run: 'CMD',
      linked: 'LinkedIn',
      git: 'Github',
    },
    file: 'File',
    edit: 'Edit',
    view: 'View',
    content: {
      about: 'Here you can tell people who you are and share your experience.',
      contact: 'Here you can add your contact details and social profiles.',
      projects: 'Here you can showcase your projects and featured work.',
    },
    socials:'Socials'
  },
  de: {
    about: 'Über mich',
    contact: 'CV',
    projects: 'Projekte',
    run: 'CMD',
    skills: 'Fähigkeiten',
    minesweeper: 'Minesweeper',
    language: 'Sprache',
    languageNames: { es: 'ES', en: 'EN', de: 'DE' },
    startMenu: {
      mines: 'Minesweeper',
      run: 'CMD',
      linked: 'LinkedInd',
      git: 'Github',
    },
    file: 'Datei',
    edit: 'Bearbeiten',
    view: 'Sehen',
    content: {
      about: 'Hier kannst du erzählen, wer du bist und welche Erfahrungen du hast.',
      contact: 'Hier kannst du deine Kontaktdaten und sozialen Profile hinzufügen.',
      projects: 'Hier kannst du deine Projekte und herausragenden Arbeiten zeigen.',
    },
    socials: 'Social Media'
  },
}

function isLocale(value: string | null): value is Locale {
  return value !== null && locales.includes(value as Locale)
}

function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'es'

  const saved = window.localStorage.getItem('portfolio-locale')
  return isLocale(saved) ? saved : 'es'
}

const locale = ref<Locale>(initialLocale())

if (typeof document !== 'undefined') {
  document.documentElement.lang = locale.value
}

export function useI18n() {
  const messages = computed(() => translations[locale.value])

  function setLocale(nextLocale: Locale) {
    locale.value = nextLocale

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('portfolio-locale', nextLocale)
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = nextLocale
    }
  }

  return { locale, messages, setLocale, locales }
}
