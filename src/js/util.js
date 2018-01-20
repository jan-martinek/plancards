const fields = require('./fields/fields');
const parser = require('expr-eval').Parser;
const autosize = require('autosize');

let timer;

function makeArray(nodelist) {
  return [].slice.call(nodelist);
}

function allArray(el, query) {
  return makeArray(el.querySelectorAll(query));
}

function findAncestor(el, className) {
  const parent = el.parentElement;

  if (parent.classList.contains(className)) return parent;
  return findAncestor(parent, className);
}


const customFunctions = {
  daysAfter: (date, days) => date.clone().add(days, 'days'),
  daysBefore: (date, days) => date.clone().subtract(days, 'days'),
};

function updateCard() {
  const card = document.getElementById('card');
  const variables = Object.assign({}, collectVariables(card), customFunctions);
  updateFormulaResults(card, variables);
  autosize.update(document.querySelectorAll('textarea'));
}

function updateCardGently() {
  clearTimeout(timer);
  timer = setTimeout(updateCard, 180);
}

function updateFormulaResults(card, variables) {
  allArray(card, '.formula').forEach((el) => {
    if (el.dataset.formula) {
      fields.write(el, parser.evaluate(el.dataset.formula, variables));
      const block = findAncestor(el, 'block');
      block.dispatchEvent(new Event('externalUpdate'));
    }
  });
}

function collectVariables(card) {
  return allArray(card, '[name]').reduce((acc, el) => {
    acc[el.getAttribute('name')] = fields.read(el);
    return acc;
  }, {});
}


module.exports = {
  allArray, findAncestor, updateCard, updateCardGently,
};
