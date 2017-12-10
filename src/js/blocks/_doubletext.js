const { wrap, init } = require('./util');
const t = require('./../translator').translate('blocks.doubletext.');

function getCode() {
  return `<div class="cell medium-6">
      <p class="desc">${t('description')}</p>
      <textarea class="in name text"></textarea>
    </div>
    <div class="cell medium-6">
      <p class="desc">${t('description')}</p>
      <textarea class="in name text"></textarea>
    </div>`;
}

function assemble() {
  const block = wrap('doubletext', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
