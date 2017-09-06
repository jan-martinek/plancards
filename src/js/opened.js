let currentId;

function save(data, templateName, cardName) {
  const now = new Date().getTime();
  if (!currentId) currentId = `card${now}`;

  localStorage.setItem(currentId, JSON.stringify({
    id: currentId,
    templateName,
    cardName,
    mtime: now,
    card: data,
  }));
}

function load(id) {
  return JSON.parse(localStorage.getItem(id));
}

function open(id) {
  currentId = id;
  return load(id);
}

function close() {
  currentId = null;
}

function remove(id) {
  localStorage.removeItem(id);
}

function list() {
  return Object.keys(localStorage)
    .filter(key => key.match(/^card\d+$/))
    .map(key => load(key))
    .sort((a, b) => b.mtime - a.mtime);
}

module.exports = {
  save,
  load,
  open,
  close,
  remove,
  list,
};
