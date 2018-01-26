const sortable = require('sortablejs');
const autosize = require('autosize');
const fields = require('./fields/fields');
const parser = require('expr-eval').Parser;

const store = require('./store');
const blocks = require('./blocks/blocks');
const workspace = require('./workspace');
const t = require('./translator').translate;
const {
  allArray,
  findAncestor,
  setClasses,
} = require('./util');

const card = document.getElementById('card');

const autosaveInterval = 5000;
let autosaveTimer;

const updateInterval = 180;
let updateTimer;

let blockSort;


function getName() {
  const nameEl = document.querySelector('[name="_activity-name"]');
  return (nameEl && nameEl.value) ? nameEl.value : 'karta';
}

function getTemplateName() {
  const nameEl = document.querySelector('.card-name');
  return (nameEl && nameEl.innerHTML) ? nameEl.innerHTML : 'šablona';
}

const blockActions = {
  'swap-blocks': (button) => {
    const block = findAncestor(button, 'block');
    const previous = block.previousSibling;
    if (previous) block.parentNode.insertBefore(block, previous);
  },
  'remove-block': (button) => {
    const block = findAncestor(button, 'block');
    block.remove();
  },
  'add-block': (button) => {
    if (button.classList.contains('opened')) {
      findAncestor(button, 'block-tools').querySelector('.add-block-tool').remove();
      button.classList.remove('opened');
    } else {
      const tools = findAncestor(button, 'block-tools');
      tools.insertAdjacentElement('beforeend', createAddBlockTool());
      button.classList.add('opened');
    }
  },
  'add-block-type': (button) => {
    const block = findAncestor(button, 'block');
    const newBlock = blocks.create(button.dataset.type);
    block.insertAdjacentElement('beforebegin', newBlock);
    allArray(newBlock, '.desc').forEach((el) => {
      el.setAttribute('contenteditable', 'true');
    });
    findAncestor(button, 'block-tools').querySelector('.add-block').classList.remove('opened');
    findAncestor(button, 'add-block-tool').remove();
  },
};

function triggerBlockToolAction(e) {
  const target = e.target.classList.contains('tool')
    ? e.target
    : e.target.parentNode.classList.contains('tool')
      ? e.target.parentNode
      : null;

  if (target) {
    Object.keys(blockActions).forEach((key) => {
      if (target.classList.contains(key)) blockActions[key](target);
    });
  }
}

function createAddBlockTool() {
  const addBlockTool = document.createElement('DIV');
  addBlockTool.classList.add('add-block-tool');
  addBlockTool.innerHTML = '<div class="arrow-up"></div><div class="content grid-x grid-margin-x"></div>';
  const content = addBlockTool.querySelector('.content');

  Object.keys(blocks.nav).forEach((navGroup) => {
    const fragment = document.createDocumentFragment();
    const section = document.createElement('section');

    setClasses(section, ['cell', 'medium-4']);
    section.innerHTML = `<p>${t('blockNav', navGroup)}</p>`;
    fragment.appendChild(section);

    blocks.nav[navGroup].forEach((key) => {
      if (key === '---') {
        section.appendChild(document.createElement('HR'));
      } else {
        const blockLink = document.createElement('A');
        setClasses(blockLink, ['tool', 'add-block-type']);
        blockLink.dataset.type = key;
        blockLink.innerHTML = t('blocks', key, 'name');
        section.appendChild(blockLink);
      }
    });

    content.appendChild(fragment);
  });

  return addBlockTool;
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

function startAutosave() {
  clearInterval(autosaveTimer);
  autosaveTimer = setInterval(save, autosaveInterval);
}

function stopAutosave() {
  clearInterval(autosaveTimer);
}


function download() {
  store.exportCard(getName(), pollData());
}

function downloadTemplate() {
  store.exportCard(getTemplateName(), pollData(true));
}

function fileImport(files, callback) {
  store.importFromFile(files, callback);
}

function urlImport(query, callback) {
  if (query.cardurl) {
    store.importFromUrl(query.cardurl, callback);
  } else if (query.cardjson) {
    store.importFromEncodedString(query.cardjson, callback);
  }
}

function load(data) {
  const fragment = document.createDocumentFragment();
  data.forEach((block) => {
    fragment.appendChild(blocks.create(block.type, block.data));
  });
  card.appendChild(fragment);
  update();
  startAutosave();

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

function close() {
  stopAutosave();
  save();
  workspace.close();

  card.innerHTML = '';
}

function save() {
  workspace.save(pollData(), getTemplateName(), getName());
}


const customFunctions = {
  daysAfter: (date, days) => date.clone().add(days, 'days'),
  daysBefore: (date, days) => date.clone().subtract(days, 'days'),
};

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
  urlImport,
  fileImport,
  download,
  downloadTemplate,
  triggerBlockToolAction,
  update,
  softUpdate,
};
