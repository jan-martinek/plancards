const { allArray, setClasses } = require('./util');

const displayValues = {
  card: { shown: 'block', hidden: 'none' },
  toolbar: { shown: 'flex', hidden: 'none' },
  dashboard: { shown: 'flex', hidden: 'none' },
  'none-opened': { shown: 'block', hidden: 'none' },
};


// App mode
function showCard() {
  hide('dashboard');
  show('card', 'toolbar');
  setFillMode();
}

function showDashboard() {
  show('dashboard');
  hide('card', 'toolbar');
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
}

function toggleMode() {
  if (document.body.classList.contains('fill-mode')) setEditMode();
  else setFillMode();
}

// Basic
function show() {
  [].forEach.call(arguments, (id) => {
    document.getElementById(id).style.display = displayValues[id].shown;
  });
}

function hide() {
  [].forEach.call(arguments, (id) => {
    document.getElementById(id).style.display = displayValues[id].hidden;
  });
}

module.exports = {
  showCard,
  showDashboard,
  toggleMode,
  show,
  hide,
};
