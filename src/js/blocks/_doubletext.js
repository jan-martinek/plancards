const { wrap, init } = require('./util');

function getCode() {
  return `<div class="cell medium-6">
      <p class="desc">Popis</p>
      <textarea class="in name text"></textarea>
    </div>
    <div class="cell medium-6">
      <p class="desc">Popis</p>
      <textarea class="in name text"></textarea>
    </div>`;
}

function assemble() {
  const block = wrap('doubletext', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
