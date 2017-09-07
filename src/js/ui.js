const queryString = require('query-string');
const moment = require('moment');
const sortable = require('sortablejs');

const blocks = require('./blocks/blocks');
const store = require('./store');
const { allArray, findAncestor, updateCard } = require('./util');
const opened = require('./opened');
const translator = require('./translator');

translator.selectDictionary('cs');
const t = translator.translate;
let blockSort;

// dashboard / card
function closeCard() {
  opened.save(pollData(), getTemplateName(), getCardName());
  opened.close();

  document.getElementById('card').innerHTML = '';
  showDashboard();
}

function showDashboard() {
  refreshOpened();

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
  initOpened();
  preventSubmit();
  showDashboard();
}

function initExportCard() {
  document.getElementById('save').addEventListener('click', (e) => {
    store.exportCard(getCardName(), pollData());
    e.preventDefault();
  });
  document.getElementById('saveTemplate').addEventListener('click', (e) => {
    store.exportCard(getTemplateName(), pollData(true));
    e.preventDefault();
  });
}

function getCardName() {
  const nameEl = document.querySelector('[name="_activity-name"]');
  return (nameEl && nameEl.value) ? nameEl.value : 'karta';
}

function getTemplateName() {
  const nameEl = document.querySelector('.card-name');
  return (nameEl && nameEl.innerHTML) ? nameEl.innerHTML : 'šablona';
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
  if (query.cardurl) {
    store.importCardFromUrl(query.cardurl, loadCard);

    const loc = window.location;
    window.history.replaceState(null, null, `${loc.pathname}`);
  }
}

function loadCard(data) {
  const card = document.getElementById('card');
  const fragment = document.createDocumentFragment();
  data.forEach((block) => {
    fragment.appendChild(blocks.create(block.type, block.data));
  });
  card.appendChild(fragment);
  showCard();
  updateCard();

  if (blockSort) blockSort.destroy();
  blockSort = sortable.create(card, {
    animation: 150,
    handle: '.blockHandle',
    draggable: '.block',
    filter: '.block-header, .block-final',
    preventOnFilter: false,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
  });
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

function initOpened() {
  const listEl = document.getElementById('opened-list');

  listEl.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.classList.contains('card-link')) {
      loadCard(opened.open(e.target.dataset.id).card);
    } else if (e.target.classList.contains('card-remove')) {
      opened.remove(e.target.dataset.id);
      refreshOpened();
    }
  });
}

function refreshOpened() {
  const list = opened.list();
  const listEl = document.getElementById('opened-list');
  listEl.innerHTML = '';

  if (list.length > 0) {
    const fragment = document.createDocumentFragment();
    list.forEach((card) => {
      const date = moment(card.mtime).format(t('dateFormat'));
      const item = document.createElement('LI');
      item.innerHTML = `<p>
        <a class="card-link" data-id="${card.id}">${card.cardName}</a>
        <i class="fa fa-times card-remove" data-id="${card.id}" aria-hidden="true"></i>
        <br>
        <span class="label">${card.templateName}</span>
        <span class="label">${date}</span>
      </p>`;
      fragment.appendChild(item);
    });
    listEl.appendChild(fragment);
    setDisplay('opened-none', 'none');
  } else {
    setDisplay('opened-none', 'block');
  }
}


module.exports = { init };
