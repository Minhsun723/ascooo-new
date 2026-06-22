/**
 * ASCOOO — i18n Module
 * Simple bilingual switch (zh-TW / en)
 */

const I18n = (() => {
  let currentLang = localStorage.getItem('ascooo-lang') || 'zh-TW';
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

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedValue(data, key);
      if (value !== null) {
        // Support HTML content (for <strong> etc.)
        if (value.includes('<')) {
          el.innerHTML = value.replace(/\n/g, '<br>');
        } else {
          el.textContent = value.replace(/\n/g, '\n');
        }
      }
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = getNestedValue(data, key);
      if (value !== null) {
        el.setAttribute('placeholder', value);
      }
    });

    // Update lang buttons
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang-btn') === currentLang);
    });

    // Update html lang attribute
    document.documentElement.lang = currentLang === 'zh-TW' ? 'zh-TW' : 'en';
  }

  async function init() {
    try {
      // Preload both languages
      await Promise.all([loadLang('zh-TW'), loadLang('en')]);
      applyTranslations();

      // Bind language switch buttons
      document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        btn.addEventListener('click', () => {
          const lang = btn.getAttribute('data-lang-btn');
          switchLang(lang);
        });
      });

      // Remove loading state
      document.documentElement.classList.remove('i18n-loading');
    } catch (error) {
      console.error('Failed to load language', error);
      document.documentElement.classList.remove('i18n-loading');
    }
  }

  function switchLang(lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem('ascooo-lang', lang);
    applyTranslations();
  }

  function getLang() {
    return currentLang;
  }

  return { init, switchLang, getLang };
})();
