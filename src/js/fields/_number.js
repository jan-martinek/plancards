const { activate } = require('./util');

function init(el) {
  el.dataset.isFloat = el.classList.contains('float') ? 'true' : 'false';
  activate(el, 'number');
}

function read(el) {
  return parseNumber(el, el.value);
}

function write(el, val) {
  el.value = parseNumber(el, val);
}

function parseNumber(el, val) {
  const numeric = el.dataset.isFloat === 'true'
    ? parseFloat(val, 10)
    : parseInt(val, 10);
  return Number.isNaN(numeric) ? 0 : numeric;
}


module.exports = { init, read, write };
