const { wrap, init } = require('./util');

function getCode() {
  return `<div class="cell"><p class="desc">Popis</p></div>
      <div class="cell"><textarea class="in name text"></textarea></div>`;
}

function assemble() {
  const block = wrap('bigtext', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
