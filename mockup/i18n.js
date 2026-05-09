// Whoadunit — EN/BM toggle runtime (mockup demo).
// Reads `data-en` / `data-ms` attributes from elements and swaps content on
// language change. Supports body text plus a few common attributes (placeholder,
// aria-label, title, alt) via the `data-{lang}-{attr}` pattern.
(function () {
  const KEY = 'whoadunit:lang';
  const LANGS = ['en', 'ms'];
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];

  function getLang() {
    const stored = localStorage.getItem(KEY);
    return LANGS.includes(stored) ? stored : 'en';
  }

  function setLang(lang) {
    if (!LANGS.includes(lang)) return;
    localStorage.setItem(KEY, lang);
    apply(lang);
  }

  function apply(lang) {
    lang = lang || getLang();
    document.documentElement.setAttribute('lang', lang === 'ms' ? 'ms' : 'en');

    document.querySelectorAll('[data-en]').forEach(el => {
      const v = el.getAttribute('data-' + lang);
      if (v != null) el.innerHTML = v;
    });

    ATTRS.forEach(attr => {
      document.querySelectorAll('[data-en-' + attr + ']').forEach(el => {
        const v = el.getAttribute('data-' + lang + '-' + attr);
        if (v != null) el.setAttribute(attr, v);
      });
    });

    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      const isActive = btn.dataset.langSet === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  function init() {
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.langSet));
    });
    apply(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Whoadunit = { getLang, setLang, applyLang: apply };
})();
