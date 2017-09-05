const { wrap, init } = require('./util');

function getCode() {
  return `<div class="cell medium-3">
        <input type="text" class="out formula date">
      </div>
      <div class="cell medium-9">
        <p class="desc">Popis</p>
      </div>`;
}

function assemble() {
  const block = wrap('dateoutput', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
