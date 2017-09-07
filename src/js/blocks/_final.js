const { wrap, init } = require('./util');

function getCode() {
  return `<div class="cell"><p style="height: 1rem">&nbsp;</p></div>`;
}

function assemble() {
  const block = wrap('final', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
