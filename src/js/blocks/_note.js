const { wrap, init } = require('./util');

function getCode() {
  return '<div class="cell"><p class="desc">Text poznámky</p></div>';
}

function assemble() {
  const block = wrap('note', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
