import en from './en.js'

const locales = { en }

let currentLocale = 'en'

export function setLocale(locale) {
  if (locales[locale]) currentLocale = locale
}

export function getLocale() {
  return currentLocale
}

export function t(key) {
  const keys = key.split('.')
  let value = locales[currentLocale]
  for (const k of keys) {
    if (value === undefined) return key
    value = value[k]
  }
  return value ?? key
}

export default { t, setLocale, getLocale }
