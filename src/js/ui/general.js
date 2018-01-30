const moment = require('moment');

const { findAncestor } = require('./util');
const { show, hide } = require('./mode');
const t = require('./../translator').translate;


function highlightFileImport() {
  const input = document.getElementById('loadFromFile');
  const label = findAncestor(input, 'callout');
  label.insertBefore(document.createTextNode(`${t('openFromFileHl')} `), input);
  label.classList.add('labelHighlight');
}

function refreshWorkspace(list) {
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

module.exports = {
  highlightFileImport,
  refreshWorkspace,
};
