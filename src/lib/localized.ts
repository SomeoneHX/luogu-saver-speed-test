export type Locale = 'zh' | 'en'

export type Localized = Record<Locale, string>

export function pickLocalized(text: Localized, locale: Locale): string {
  return text[locale]
}
