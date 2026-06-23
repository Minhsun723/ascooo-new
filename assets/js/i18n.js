/**
 * ASCOOO — i18n Module
 * Language is determined purely by URL path (/en/* = English, else zh-TW).
 * nav links use [data-nav-href] and are resolved at runtime via url().
 * Language toggle uses [data-lang-link] anchors with href set by this module.
 */

const I18n = (() => {
  const pathname = window.location.pathname;
  const isEn = pathname.startsWith('/en/') || pathname === '/en';
  const currentLang = isEn ? 'en' : 'zh-TW';

  // Paths that are shared between languages (no /en/ copies)
  const SHARED_PREFIXES = ['/works/', '/news/'];
  const isSharedPath = SHARED_PREFIXES.some(p => pathname.startsWith(p));

  /**
   * url(path) — prepend /en prefix when on an English page.
   * path should start with '/', e.g. '/about', '/', '/contact'
   */
  function url(path) {
    // Shared sub-pages (works/news detail) never get /en prefix
    const sharedPrefixes = ['/works/', '/news/'];
    if (sharedPrefixes.some(p => path.startsWith(p))) return path;
    if (isEn) {
      // '/' -> '/en', '/about' -> '/en/about'
      return path === '/' ? '/en' : `/en${path}`;
    }
    return path;
  }

  let translations = {};

  async function loadLang(lang) {
    try {
      const res = await fetch(`/assets/i18n/${lang}.json`);
      if (!res.ok) throw new Error(`Failed to load ${lang}`);
      translations[lang] = await res.json();
    } catch (e) {
      console.error(`[i18n] Error loading ${lang}:`, e);
    }
  }

  function getNestedValue(obj, keyPath) {
    return keyPath.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }

  function applyTranslations() {
    const data = translations[currentLang];
    if (!data) return;

    // Apply text / HTML translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedValue(data, key);
      if (value !== null) {
        if (value.includes('<')) {
          el.innerHTML = value.replace(/\n/g, '<br>');
        } else {
          el.textContent = value.replace(/\n/g, '\n');
        }
      }
    });

    // Apply placeholder translations
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = getNestedValue(data, key);
      if (value !== null) el.setAttribute('placeholder', value);
    });

    // Update html lang attribute
    document.documentElement.lang = currentLang;
  }

  function applyNavHrefs() {
    // Resolve all [data-nav-href] links using url() helper
    document.querySelectorAll('[data-nav-href]').forEach(el => {
      el.setAttribute('href', url(el.getAttribute('data-nav-href')));
    });
  }

  function applyLangLinks() {
    // Set href and is-active on language switcher anchors
    document.querySelectorAll('[data-lang-link]').forEach(btn => {
      const lang = btn.getAttribute('data-lang-link');

      if (isSharedPath) {
        // On shared pages (works/news sub-pages), no EN version exists—go to homepage
        btn.setAttribute('href', lang === 'en' ? '/en' : '/');
        // These pages are always zh-TW
        btn.classList.toggle('is-active', lang === 'zh-TW');
      } else if (lang === 'en') {
        // Strip /en prefix from current path to get the equivalent page path
        const basePath = pathname.replace(/^\/en(\/|$)/, '/');
        btn.setAttribute('href', `/en${basePath === '/' ? '' : basePath}`);
        btn.classList.toggle('is-active', lang === currentLang);
      } else {
        // zh-TW: strip /en prefix
        const basePath = pathname.replace(/^\/en(\/|$)/, '/');
        btn.setAttribute('href', basePath || '/');
        btn.classList.toggle('is-active', lang === currentLang);
      }
    });
  }

  async function init() {
    try {
      await loadLang(currentLang);
      applyTranslations();
      applyNavHrefs();
      applyLangLinks();
      document.documentElement.classList.remove('i18n-loading');
    } catch (error) {
      console.error('[i18n] Failed to initialize:', error);
      document.documentElement.classList.remove('i18n-loading');
    }
  }

  function getLang() {
    return currentLang;
  }

  return { init, url, getLang };
})();
