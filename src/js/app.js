const queryString = require('query-string');

const workspace = require('./workspace');
const store = require('./store');

const ui = require('./ui/general');
const mode = require('./ui/mode');
const card = require('./ui/card');
const blockTool = require('./ui/block-tool');
const lang = require('./ui/lang');

const autosaveInterval = 5000;
let autosaveTimer;

function init() {
  lang.initLangSelector();
  bindActions();
  initImport();

  mode.showDashboard();
  ui.refreshWorkspace(workspace.list());
  lang.refreshTranslations();
}


function bindActions() {
  const clickActions = {
    '.mode-toggle': toggleMode,
    '.lang-selector': lang.switchLanguage,
    '#close': closeCard,
    '#save': download,
    '#saveTemplate': downloadTemplate,
    '#card': blockTool.trigger,
    '#workspace': triggerWorkspaceAction,
  };

  Object.keys(clickActions).forEach((elId) => {
    document.querySelector(elId)
      .addEventListener('click', (event) => {
        event.preventDefault();
        clickActions[elId](event);
      });
  });

  document.body
    .addEventListener('input', () => card.softUpdate());

  document.getElementById('loadFromFile')
    .addEventListener('change', (e) => {
      store.importFromFile(e.target.files[0], openCard);
    });
}

function triggerWorkspaceAction(e) {
  const { classList, dataset } = e.target;

  if (classList.contains('card-link')) openCard(workspace.open(dataset.id).card);
  else if (classList.contains('card-remove')) removeCard(dataset.id);
}


function openCard(data) {
  mode.showCard();
  card.load(data);
  startAutosave();
}

function closeCard() {
  stopAutosave();
  save();
  card.close();
  workspace.close();
  ui.refreshWorkspace(workspace.list());
  mode.showDashboard();
}

function removeCard(id) {
  workspace.remove(id);
  ui.refreshWorkspace(workspace.list());
}

function toggleMode() {
  mode.toggleMode();
  card.update();
}


function initImport() {
  const query = queryString.parse(window.location.search);
  if (query.entry && query.entry === 'savedCard') {
    ui.highlightFileImport();
    removeUrlParams();
  } else if (query.cardjson || query.cardurl) {
    store.urlImport(query, openCard);
    removeUrlParams();
  }
}


function save() {
  workspace.save(card.pollData(), card.getTemplateName(), card.getName());
}

function startAutosave() {
  clearInterval(autosaveTimer);
  autosaveTimer = setInterval(save, autosaveInterval);
}

function stopAutosave() {
  clearInterval(autosaveTimer);
}


function download() {
  store.exportCard(card.getName(), card.pollData());
}

function downloadTemplate() {
  store.exportCard(card.getTemplateName(), card.pollData(true));
}

function removeUrlParams() {
  window.history.replaceState(null, null, `${window.location.pathname}`);
}


module.exports = { init };
