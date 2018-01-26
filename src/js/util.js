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

function setClasses(el, add, remove) {
  if (add && add.length > 0) {
    add.forEach(className => el.classList.add(className));
  }
  if (remove && remove.length > 0) {
    remove.forEach(className => el.classList.remove(className));
  }
}


const displayValues = {
  card: { shown: 'block', hidden: 'none' },
  toolbar: { shown: 'flex', hidden: 'none' },
  dashboard: { shown: 'flex', hidden: 'none' },
  'none-opened': { shown: 'block', hidden: 'none' },
};

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

function removeUrlParams() {
  window.history.replaceState(null, null, `${window.location.pathname}`);
}


module.exports = {
  allArray,
  findAncestor,
  setClasses,
  show,
  hide,
  removeUrlParams,
};
