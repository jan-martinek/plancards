const translator = require('./../translator');
const { allArray } = require('./util');

function initLangSelector() {
  document.querySelector('.lang-selector').innerHTML = translator.getLanguages()
    .map(lang => `<a href="" data-lang="${lang.short}">${lang.name}</a>`)
    .join(' &middot; ');
  updateLangSelector();
}

function updateLangSelector() {
  const current = translator.getLang();
  document.querySelectorAll('.lang-selector a').forEach((el) => {
    if (el.dataset.lang === current) el.classList.add('current');
    else el.classList.remove('current');
  });
}

function switchLanguage(event) {
  if (event.target.tagName === 'A') {
    translator.setLang(event.target.dataset.lang);
    refreshTranslations();
    updateLangSelector();
  }
}

function refreshTranslations() {
  const currentLang = translator.getLang();

  allArray(document.querySelector('html'), '[data-phrase]').forEach((el) => {
    if (el.dataset.currentLang !== currentLang) {
      el.dataset.currentLang = currentLang;
      if (el.dataset.tt) {
        el.setAttribute(el.dataset.tt, translator.translate(el.dataset.phrase));
      } else {
        el.innerHTML = translator.translate(el.dataset.phrase);
      }
    }
  });
}

module.exports = {
  initLangSelector,
  switchLanguage,
  refreshTranslations,
};
