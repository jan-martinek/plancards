const { wrap, init } = require('./util');
const t = require('./../translator').translate('blocks.note.');

function getCode() {
  return `<div class="cell"><p class="desc">${t('text')}</p></div>`;
}

function assemble() {
  const block = wrap('note', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
