import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from './en.js'
import ms from './ms.js'

const STORAGE_KEY = 'whoadunit:lang'
const SUPPORTED = ['en', 'ms']

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
})

function readKey(bundle, key) {
  if (!bundle) return undefined
  const parts = key.split('.')
  let v = bundle
  for (const p of parts) {
    if (v == null) return undefined
    v = v[p]
  }
  return v
}

function readInitialLang() {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return SUPPORTED.includes(stored) ? stored : 'en'
}

const bundles = { en, ms }

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang)

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch (_) {
      /* ignore storage failures (private mode etc.) */
    }
  }, [lang])

  const setLang = useCallback((next) => {
    if (SUPPORTED.includes(next)) setLangState(next)
  }, [])

  const t = useCallback(
    (key, fallback) => {
      const primary = readKey(bundles[lang], key)
      if (primary != null) return primary
      const enFallback = readKey(bundles.en, key)
      if (enFallback != null) return enFallback
      return fallback ?? key
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function useT() {
  return useContext(LanguageContext).t
}
