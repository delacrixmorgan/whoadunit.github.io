import { useEffect } from 'react'

const SITE_NAME = 'WhoAdUnit'

function setMeta(selector, value) {
  let el = document.querySelector(selector)
  if (!el) return
  if (el.hasAttribute('content')) el.setAttribute('content', value)
}

export function usePageMeta({ title, description }) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`
    document.title = fullTitle
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', window.location.href)
    setMeta('meta[name="twitter:title"]', fullTitle)
    setMeta('meta[name="twitter:description"]', description)
  }, [title, description])
}
