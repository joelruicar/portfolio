import { computed, ref } from 'vue'

export const locales = ['es', 'en', 'de'] as const
export type Locale = (typeof locales)[number]

type Translation = {
  about: string
  contact: string
  projects: string
  language: string
  languageNames: Record<Locale, string>
}

const translations: Record<Locale, Translation> = {
  es: {
    about: 'Sobre mí',
    contact: 'Contacto',
    projects: 'Proyectos',
    language: 'Idioma',
    languageNames: { es: 'ES', en: 'ENG', de: 'DEU' },
  },
  en: {
    about: 'About me',
    contact: 'Contact',
    projects: 'Projects',
    language: 'Language',
    languageNames: { es: 'ES', en: 'ENG', de: 'DEU' },
  },
  de: {
    about: 'Über mich',
    contact: 'Kontakt',
    projects: 'Projekte',
    language: 'Sprache',
    languageNames: { es: 'ES', en: 'ENG', de: 'DEU' },
  },
}

function initialLocale(): Locale {
  const saved = localStorage.getItem('portfolio-locale')
  return locales.includes(saved as Locale) ? (saved as Locale) : 'es'
}

const locale = ref<Locale>(initialLocale())

export function useI18n() {
  const messages = computed(() => translations[locale.value])

  function setLocale(nextLocale: Locale) {
    locale.value = nextLocale
    localStorage.setItem('portfolio-locale', nextLocale)
  }

  return { locale, messages, setLocale, locales }
}
