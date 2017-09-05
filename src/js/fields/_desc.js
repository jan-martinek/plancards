function init(el) {
  el.dataset.fieldName = 'desc';
}

function read(el) {
  return el.innerHTML;
}

function write(el, val) {
  el.innerHTML = val;
}


module.exports = { init, read, write };
