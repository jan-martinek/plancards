const { activate } = require('./util');

function init(el) {
  activate(el, 'bool');
}

function read(el) {
  return el.value === 'true';
}

function write(el, val) {
  el.value = val;
}


module.exports = { init, read, write };
