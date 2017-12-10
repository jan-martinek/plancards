const { wrap, init } = require('./util');
const t = require('./../translator').translate('blocks.number.');

function getCode() {
  return `<div class="cell medium-3">
    <input type="text" class="in name number">
  </div>
  <div class="cell medium-9">
    <p class="desc">${t('description')}</p>
  </div>
  `;
}

function assemble() {
  const block = wrap('number', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
