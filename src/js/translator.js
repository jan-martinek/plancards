const cs = require('./translations/cs').dictionary;

const dictionaries = {
  cs,
};

let dictionary;

function selectDictionary(lang) {
  dictionary = dictionaries[lang];
}

function translate(keys) {
  const keylist = (arguments.length > 1) ? [].slice.call(arguments) : keys.split('.');
  return keylist.reduce((prev, curr) => (prev ? prev[curr] : undefined), dictionary);
}

module.exports = { selectDictionary, translate };
