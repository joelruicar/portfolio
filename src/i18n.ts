import { computed, ref } from 'vue'

export const locales = ['es', 'en', 'de'] as const
export type Locale = (typeof locales)[number]

type Translation = {
  about: string
  contact: string
  projects: string
  minesweeper: string
  language: string
  languageNames: Record<Locale, string>
  content: {
    about: string
    contact: string
    projects: string
  }
  file: string
  edit: string
  view: string
}

const translations: Record<Locale, Translation> = {
  es: {
    about: 'Sobre mí',
    contact: 'Contacto',
    projects: 'Proyectos',
    minesweeper: 'Buscaminas',
    language: 'Idioma',
    languageNames: { es: 'ES', en: 'EN', de: 'DE' },
    file: 'Fichero',
    edit: 'Editar',
    view: 'Ver',
    content: {
      about: 'Aquí puedes contar quién eres y cuál es tu experiencia.',
      contact: 'Aquí puedes añadir tus datos de contacto y tus redes.',
      projects: 'Aquí puedes mostrar tus proyectos y trabajos destacados.',
    }
  },
  en: {
    about: 'About me',
    contact: 'Contact',
    projects: 'Projects',
    minesweeper: 'Minesweeper',
    language: 'Language',
    languageNames: { es: 'ES', en: 'EN', de: 'DE' },
    file: 'File',
    edit: 'Edit',
    view: 'View',
    content: {
      about: 'Here you can tell people who you are and share your experience.',
      contact: 'Here you can add your contact details and social profiles.',
      projects: 'Here you can showcase your projects and featured work.',
    },
  },
  de: {
    about: 'Über mich',
    contact: 'Kontakt',
    projects: 'Projekte',
    minesweeper: 'Minesweeper',
    language: 'Sprache',
    languageNames: { es: 'ES', en: 'EN', de: 'DE' },
    file: 'Datei',
    edit: 'Bearbeiten',
    view: 'Sehen',
    content: {
      about: 'Hier kannst du erzählen, wer du bist und welche Erfahrungen du hast.',
      contact: 'Hier kannst du deine Kontaktdaten und sozialen Profile hinzufügen.',
      projects: 'Hier kannst du deine Projekte und herausragenden Arbeiten zeigen.',
    },
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
