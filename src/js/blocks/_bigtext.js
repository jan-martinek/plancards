const { wrap, init } = require('./util');
const t = require('./../translator').translate('blocks.bigtext.');

function getCode() {
  return `<div class="cell"><p class="desc">${t('description')}</p></div>
      <div class="cell"><textarea class="in name text"></textarea></div>`;
}

function assemble() {
  const block = wrap('bigtext', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
