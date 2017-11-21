const { activate } = require('./util');

function init(el) {
  activate(el, 'checkbox');
}

function read(el) {
  return el.checked;
}

function write(el, val) {
  el.checked = val;
}


module.exports = { init, read, write };
