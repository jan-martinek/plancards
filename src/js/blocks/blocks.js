const { allArray } = require('./../util.js');
const fields = require('./../fields/fields');
const autosize = require('autosize');

const dateinput = require('./_dateinput');
const dateoutput = require('./_dateoutput');
const header = require('./_header');
const indicator = require('./_indicator');
const pricelist = require('./_pricelist');
const number = require('./_number');
const separator = require('./_separator');
const subhead = require('./_subhead');
const sum = require('./_sum');

const all = {
  dateinput,
  dateoutput,
  header,
  indicator,
  pricelist,
  number,
  separator,
  subhead,
  sum,
};

function create(type, data) {
  const block = all[type].assemble();
  if (data) fill(block, data);
  if (all[type].update) all[type].update(block);
  autosize(block.querySelectorAll('textarea'));
  return block;
}

function poll(wrapper) {
  return {
    type: wrapper.dataset.type,
    data: {
      inputs: pollFieldType(wrapper, '.in'),
      descriptions: pollFieldType(wrapper, '.desc'),
      names: pollNames(wrapper),
      formulas: pollFormulas(wrapper),
    },
  };
}

function pollFieldType(wrapper, fieldName) {
  return allArray(wrapper, fieldName).map(el => fields.read(el));
}

function pollNames(wrapper) {
  return allArray(wrapper, '.name-setter').map(el => el.value);
}

function pollFormulas(wrapper) {
  return allArray(wrapper, '.formula-setter').map(el => el.value);
}

function fill(wrapper, data) {
  fillFieldType(wrapper, '.in', data.inputs);
  fillFieldType(wrapper, '.desc', data.descriptions);
  fillNames(wrapper, data.names);
  fillFormulas(wrapper, data.formulas);
}

function fillFieldType(wrapper, fieldName, data) {
  if (data) {
    allArray(wrapper, fieldName).forEach((el, index) => {
      if (data[index]) fields.write(el, data[index]);
    });
  }
}

function fillNames(wrapper, data) {
  if (data) {
    allArray(wrapper, '.name-setter').forEach((el, index) => {
      if (data[index]) {
        el.value = data[index];
        el.dispatchEvent(new Event('input'));
      }
    });
  }
}

function fillFormulas(wrapper, data) {
  if (data) {
    allArray(wrapper, '.formula-setter').forEach((el, index) => {
      if (data[index]) {
        el.value = data[index];
        el.dispatchEvent(new Event('input'));
      }
    });
  }
}


module.exports = {
  create,
  poll,
  fill,
  all,
};
