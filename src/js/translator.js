const cs = require('./translations/cs');
const en = require('./translations/en');
const cookies = require('doc-cookies');

const dictionaries = {
  en,
  cs,
};

let dictionary = dictionaries[getLang()];

function getLang() {
  const saved = cookies.hasItem('lang') && dictionaries[cookies.getItem('lang')];
  return saved ? cookies.getItem('lang') : 'en';
}

function setLang(lang) {
  if (dictionaries[lang]) {
    cookies.setItem('lang', lang);
    dictionary = dictionaries[lang];
  }
}

function getLanguages() {
  return Object.keys(dictionaries).map(short => ({ short, name: dictionaries[short].lang }));
}

function translate(keys) {
  if (keys.match(/\.$/)) {
    return subkey => translate(keys + subkey);
  }

  const keylist = (arguments.length > 1) ? [].slice.call(arguments) : keys.split('.');
  return keylist.reduce((prev, curr) => (prev ? prev[curr] : undefined), dictionary);
}

module.exports = {
  setLang,
  getLang,
  getLanguages,
  translate,
};
