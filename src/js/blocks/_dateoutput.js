const { wrap, init } = require('./util');

function getCode() {
  const todo = `<div class="grid-x todo">
    <div class="cell small-1"></div>
    <div class="cell small-11">
      <div class="input-group">
        <label class="input-group-label"><input type="checkbox" class="in checkbox"></label>
        <input type="text" class="input-group-field in text">
      </div>
    </div>
  </div>`;

  return `<div class="cell medium-3">
        <input type="text" class="out formula date">
      </div>
      <div class="cell medium-9">
        <p class="desc">Popis</p>
      </div>
      <div class="cell">
        ${todo.repeat(10)}
      </div>`;
}

function update(el) {
  hideEmpty(el.querySelectorAll('.todo'));
}

function hideEmpty(items) {
  let lastEmpty = false;
  [].slice.call(items).forEach((item) => {
    const empty = item.querySelector('[type="text"]').value === '';
    if (lastEmpty && empty) {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
    lastEmpty = empty;
  });
}

function assemble() {
  const block = wrap('dateoutput', getCode());
  init(block, update);
  return block;
}


module.exports = { assemble };
