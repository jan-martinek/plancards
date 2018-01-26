const queryString = require('query-string');
const moment = require('moment');

const card = require('./card');
const workspace = require('./workspace');
const translator = require('./translator');
const {
  allArray,
  findAncestor,
  removeUrlParams,
  setClasses,
  show,
  hide,
} = require('./util');

const t = translator.translate;

function init() {
  bindActions();
  initImport();
  updateLangSelector();
  showDashboard();
}


// General
function updateLangSelector() {
  const langs = translator.getLanguages();
  const current = translator.getLang();

  document.querySelector('.lang-selector').innerHTML = langs
    .map(lang => `<a href="#"
        data-lang="${lang.short}"
        ${current === lang.short ? 'class="current"' : ''}
      >${lang.name}</a>`)
    .join(' &middot; ');
}

function bindActions() {
  const clickActions = {
    '.mode-toggle': toggleMode,
    '#close': closeCard,
    '#save': card.download,
    '#saveTemplate': card.downloadTemplate,
    '#card': card.triggerBlockToolAction,
    '#workspace': triggerWorkspaceAction,
  };

  Object.keys(clickActions).forEach((elId) => {
    document.querySelector(elId).addEventListener('click', (event) => {
      event.preventDefault();
      clickActions[elId](event);
    });
  });

  document.querySelectorAll('.lang-selector a').forEach((el) => {
    el.addEventListener('click', () => {
      translator.setLang(el.dataset.lang);
      translator.refreshTranslations();
      updateLangSelector();
    });
  });

  document.body.addEventListener('input', () => card.softUpdate());
}


// App mode
function showDashboard() {
  show('dashboard');
  hide('card', 'toolbar');

  refreshWorkspace();
  translator.refreshTranslations();
}

function openCard(data) {
  hide('dashboard');
  show('card', 'toolbar');

  card.load(data);
  setFillMode();
}

function closeCard() {
  card.close();
  showDashboard();
}


// Card editing mode
function setEditMode() {
  setClasses(document.body, ['edit-mode'], ['fill-mode']);
  allArray(document.body, '.desc').forEach((el) => {
    el.setAttribute('contenteditable', 'true');
  });
}

function setFillMode() {
  setClasses(document.body, ['fill-mode'], ['edit-mode']);
  allArray(document.body, '.desc').forEach((el) => {
    el.removeAttribute('contenteditable');
  });
  card.update();
}

function toggleMode() {
  if (document.body.classList.contains('fill-mode')) setEditMode();
  else setFillMode();
}


// Dashboard
function initImport() {
  document.getElementById('loadFromFile').addEventListener('change', (e) => {
    card.fileImport(e.target.files[0], openCard);
  });

  const query = queryString.parse(window.location.search);
  if (query.entry && query.entry === 'savedCard') {
    highlightFileImport();
    removeUrlParams();
  } else if (query.cardjson || query.cardurl) {
    card.urlImport(query, openCard);
    removeUrlParams();
  }
}

function highlightFileImport() {
  const input = document.getElementById('loadFromFile');
  const label = findAncestor(input, 'callout');
  label.insertBefore(document.createTextNode(`${t('openFromFileHl')} `), input);
  label.classList.add('labelHighlight');
}

function triggerWorkspaceAction(e) {
  if (e.target.classList.contains('card-link')) {
    openCard(workspace.open(e.target.dataset.id).card);
  } else if (e.target.classList.contains('card-remove')) {
    workspace.remove(e.target.dataset.id);
    refreshWorkspace();
  }
}

function refreshWorkspace() {
  const list = workspace.list();
  const workspaceEl = document.getElementById('workspace');
  workspaceEl.innerHTML = '';

  if (list.length > 0) {
    const fragment = document.createDocumentFragment();
    list.forEach((openedCard) => {
      const date = moment(openedCard.mtime).format(t('dateFormat'));
      const item = document.createElement('LI');
      item.innerHTML = `<p>
        <a class="card-link" data-id="${openedCard.id}">${openedCard.cardName}</a>
        <i class="fa fa-times card-remove" data-id="${openedCard.id}" aria-hidden="true"></i>
        <br>
        <span class="label">${openedCard.templateName}</span>
        <span class="label">${date}</span>
      </p>`;
      fragment.appendChild(item);
    });
    workspaceEl.appendChild(fragment);
    hide('none-opened');
  } else {
    show('none-opened');
  }
}


module.exports = { init };
