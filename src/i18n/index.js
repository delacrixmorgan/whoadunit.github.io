// Re-exports for backward compatibility. Prefer `useT()` / `useLanguage()` from
// './LanguageContext.jsx' inside React components — those react to the active
// language. The function below is a non-reactive escape hatch that always
// returns English and is only kept for occasional non-component callers.
import en from './en.js'

export { LanguageProvider, useLanguage, useT } from './LanguageContext.jsx'

export function t(key) {
  const parts = key.split('.')
  let v = en
  for (const p of parts) {
    if (v == null) return key
    v = v[p]
  }
  return v ?? key
}
