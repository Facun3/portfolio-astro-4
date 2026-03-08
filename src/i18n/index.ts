import en from './en.json';
import es from './es.json';

const translations = { en, es };

export type Lang = keyof typeof translations;

export function getBrowserLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const lang = navigator.language.split('-')[0];
  return lang in translations ? (lang as Lang) : 'en';
}

export function t(lang: Lang, key: string): string {
  return translations[lang][key] || translations['en'][key] || key;
}

export function getAllTranslations(lang: Lang): Record<string, string> {
  return translations[lang] || translations['en'];
}
