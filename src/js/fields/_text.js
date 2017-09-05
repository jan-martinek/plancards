const { activate } = require('./util');

function init(el) {
  activate(el, 'text');
}

function read(el) {
  return el.value;
}

function write(el, val) {
  el.value = val;
}


module.exports = { init, read, write };
