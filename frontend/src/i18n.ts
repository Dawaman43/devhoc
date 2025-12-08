import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      share: 'Share',
      back: 'Back',
      anonymous: 'Anonymous',
      you_reacted: 'You reacted',
      loading_editor: 'Loading editor…',
    },
  },
  fr: {
    translation: {
      share: 'Partager',
      back: 'Retour',
      anonymous: 'Anonyme',
      you_reacted: 'Vous avez réagi',
      loading_editor: "Chargement de l'éditeur…",
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
