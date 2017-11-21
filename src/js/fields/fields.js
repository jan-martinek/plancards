const bool = require('./_bool');
const date = require('./_date');
const desc = require('./_desc');
const number = require('./_number');
const text = require('./_text');
const checkbox = require('./_checkbox');

const all = {
  bool,
  date,
  desc,
  number,
  text,
  checkbox,
};

function read(activeField) {
  return all[activeField.dataset.fieldName].read(activeField);
}

function write(activeField, val) {
  all[activeField.dataset.fieldName].write(activeField, val);
}


module.exports = { read, write, all };
