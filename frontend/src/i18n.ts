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
  sw: {
    translation: {
      share: 'Shiriki',
      back: 'Rudi',
      anonymous: 'Asiyejulikana',
      you_reacted: 'Umeitikia',
      loading_editor: 'Inapakua mhariri…',
    },
  },
  am: {
    translation: {
      share: 'አካፍል',
      back: 'ወደ ኋላ',
      anonymous: 'ያልታወቀ',
      you_reacted: 'አመለከትህ',
      loading_editor: 'አርታኢ መጫን ላይ…',
    },
  },
  yo: {
    translation: {
      share: 'Pin',
      back: 'Pada',
      anonymous: 'Aìmọ̀',
      you_reacted: 'O fèsì',
      loading_editor: 'N gbé olùṣàtúnṣe wọlé…',
    },
  },
  ha: {
    translation: {
      share: 'Raba',
      back: 'Komawa',
      anonymous: 'Ba a sani ba',
      you_reacted: 'Ka yi martani',
      loading_editor: 'Ana loda edita…',
    },
  },
  ar: {
    translation: {
      share: 'شارك',
      back: 'رجوع',
      anonymous: 'مجهول',
      you_reacted: 'لقد تفاعلت',
      loading_editor: 'جارٍ تحميل المُحرر…',
    },
  },
}

const detectLang = () => {
  if (typeof navigator !== 'undefined') {
    const langs = navigator.languages || [navigator.language]
    for (const l of langs) {
      const code = l.split('-')[0]
      if (resources[code as keyof typeof resources]) return code
    }
  }
  return 'en'
}

i18n.use(initReactI18next).init({
  resources,
  lng: detectLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
