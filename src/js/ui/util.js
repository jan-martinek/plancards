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

module.exports = {
  allArray,
  findAncestor,
  setClasses,
};
