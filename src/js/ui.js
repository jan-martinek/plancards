const queryString = require('query-string');
const moment = require('moment');

const blocks = require('./blocks/blocks');
const store = require('./store');
const { allArray, findAncestor, updateCard } = require('./util');
const translator = require('./translator');
const t = translator.translate;

translator.selectDictionary('cs');

// dashboard / card
function closeCard() {
  document.getElementById('card').innerHTML = '';
  showDashboard();
}

function showDashboard() {
  setDisplay('card', 'none');
  setDisplay('toolbar', 'none');
  setDisplay('dashboard', 'flex');
}

function showCard() {
  setDisplay('card', 'block');
  setDisplay('toolbar', 'flex');
  setDisplay('dashboard', 'none');
}

function setDisplay(id, val) {
  document.getElementById(id).style.display = val;
}

// edit / fill mode
function initMode() {
  toggleMode('fill');
  document.querySelector('.mode-toggle').addEventListener('click', toggleMode);
}


const modeInitializations = {
  edit: () => {
    document.body.classList.remove('fill-mode');
    document.body.classList.add('edit-mode');
    allArray(document.body, '.desc').forEach((el) => {
      el.setAttribute('contenteditable', 'true');
    });
  },
  fill: () => {
    document.body.classList.remove('edit-mode');
    document.body.classList.add('fill-mode');
    allArray(document.body, '.desc').forEach((el) => {
      el.removeAttribute('contenteditable');
    });
    updateCard();
  },
};

function toggleMode(mode) {
  const detectedMode = typeof mode === 'string'
    ? mode
    : document.body.classList.contains('fill-mode')
      ? 'edit'
      : 'fill';

  modeInitializations[detectedMode]();
}


// block tools
const blockActions = {
  swapBlocks: (button) => {
    const block = findAncestor(button, 'block');
    const previous = block.previousSibling;
    if (previous) block.parentNode.insertBefore(block, previous);
  },
  removeBlock: (button) => {
    const block = findAncestor(button, 'block');
    block.remove();
  },
  addBlock: (button) => {
    if (button.classList.contains('opened')) {
      findAncestor(button, 'block-tools').querySelector('.add-block-tool').remove();
      button.classList.remove('opened');
    } else {
      const tools = findAncestor(button, 'block-tools');
      tools.insertAdjacentElement('beforeend', createAddBlockTool());
      button.classList.add('opened');
    }
  },
  addBlockType: (button) => {
    const block = findAncestor(button, 'block');
    const newBlock = blocks.create(button.dataset.type);
    block.insertAdjacentElement('beforebegin', newBlock);
    toggleMode('edit'); // inits edit mode on block
    findAncestor(button, 'block-tools').querySelector('.addBlock').classList.remove('opened');
    findAncestor(button, 'add-block-tool').remove();
  },
};

function createAddBlockTool() {
  const addBlockTool = document.createElement('DIV');
  addBlockTool.classList.add('add-block-tool');
  addBlockTool.innerHTML = '<div class="arrow-up"></div><div class="content"></div>';
  Object.keys(blocks.all).forEach((key) => {
    const blockLink = document.createElement('A');
    blockLink.classList.add('tool');
    blockLink.classList.add('addBlockType');
    blockLink.dataset.type = key;
    blockLink.innerHTML = t('blocks', key);
    addBlockTool.querySelector('.content').appendChild(blockLink);
  });
  return addBlockTool;
}

function initBlockTools() {
  document.getElementById('card').addEventListener('click', (e) => {
    const button = e.target.classList.contains('tool')
      ? e.target
      : e.target.parentNode.classList.contains('tool')
        ? e.target.parentNode
        : null;
    if (button) {
      Object.keys(blockActions).forEach((key) => {
        if (button.classList.contains(key)) blockActions[key](button);
      });
    }
  });
}

// prep DOM and add listeners to ui
function init() {
  initMode();
  initImportCard();
  initExportCard();
  initBlockTools();
  initCloseCard();
  preventSubmit();
  showDashboard();
}

function initExportCard() {
  document.getElementById('save').addEventListener('click', (e) => {
    const nameEl = document.querySelector('[name="_activity-name"]');
    const name = (nameEl && nameEl.value) ? nameEl.value : 'karta';
    store.exportCard(name, pollData());
    e.preventDefault();
  });
  document.getElementById('saveBlank').addEventListener('click', (e) => {
    const nameEl = document.querySelector('.card-name');
    const name = (nameEl && nameEl.innerHTML) ? nameEl.innerHTML : 'šablona';
    store.exportCard(name, pollData(true));
    e.preventDefault();
  });
}

function pollData(empty) {
  const cardExport = [];
  allArray(document.getElementById('card'), '.block').forEach((block) => {
    const info = blocks.poll(block);
    if (empty) info.data.inputs = [];
    cardExport.push(info);
  });
  return cardExport;
}

function initImportCard() {
  document.getElementById('loadFromFile').addEventListener('change', (e) => {
    store.importCardFromFile(e.target.files[0], loadCard);
    e.preventDefault();
  });
  const query = queryString.parse(window.location.search);
  if (query.cardurl) store.importCardFromUrl(query.cardurl, loadCard);
}

function loadCard(data) {
  const fragment = document.createDocumentFragment();
  data.forEach((block) => {
    fragment.appendChild(blocks.create(block.type, block.data));
  });
  document.getElementById('card').appendChild(fragment);
  showCard();
  updateCard();
}

function initCloseCard() {
  document.getElementById('close').addEventListener('click', (e) => {
    closeCard();
    e.preventDefault();
  });
}

function preventSubmit() {
  document.getElementById('card').addEventListener('submit', (e) => {
    e.preventDefault();
  });
}


module.exports = { init };
