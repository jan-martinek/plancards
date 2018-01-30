const sortable = require('sortablejs');
const autosize = require('autosize');
const parser = require('expr-eval').Parser;

const blocks = require('./../blocks/blocks');
const fields = require('./../fields/fields');
const { allArray, findAncestor } = require('./util');


const card = document.getElementById('card');

const updateInterval = 180;
let updateTimer;

let blockSort;

const customFunctions = {
  daysAfter: (date, days) => date.clone().add(days, 'days'),
  daysBefore: (date, days) => date.clone().subtract(days, 'days'),
};


function getName() {
  const nameEl = document.querySelector('[name="_activity-name"]');
  return (nameEl && nameEl.value) ? nameEl.value : 'karta';
}

function getTemplateName() {
  const nameEl = document.querySelector('.card-name');
  return (nameEl && nameEl.innerHTML) ? nameEl.innerHTML : 'šablona';
}


function load(data) {
  const fragment = document.createDocumentFragment();
  data.forEach((block) => {
    fragment.appendChild(blocks.create(block.type, block.data));
  });
  card.appendChild(fragment);
  update();

  if (blockSort) blockSort.destroy();
  blockSort = sortable.create(card, {
    animation: 150,
    handle: '.block-handle',
    draggable: '.block',
    filter: '.block-header, .block-final',
    preventOnFilter: false,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
  });
}

function pollData(empty) {
  const cardExport = [];
  allArray(card, '.block').forEach((block) => {
    const info = blocks.poll(block);
    if (empty) info.data.inputs = [];
    cardExport.push(info);
  });
  return cardExport;
}

function close() {
  card.innerHTML = '';
}


function update() {
  const variables = Object.assign({}, collectVariables(), customFunctions);
  updateFormulaResults(variables);
  autosize.update(document.querySelectorAll('textarea'));
}

function softUpdate() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(update, updateInterval);
}

function updateFormulaResults(variables) {
  allArray(card, '.formula').forEach((el) => {
    if (el.dataset.formula) {
      fields.write(el, parser.evaluate(el.dataset.formula, variables));
      const block = findAncestor(el, 'block');
      block.dispatchEvent(new Event('externalUpdate'));
    }
  });
}

function collectVariables() {
  return allArray(card, '[name]').reduce((acc, el) => {
    acc[el.getAttribute('name')] = fields.read(el);
    return acc;
  }, {});
}


module.exports = {
  load,
  close,
  pollData,
  getName,
  getTemplateName,
  update,
  softUpdate,
};
