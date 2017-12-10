const { wrap, init } = require('./util');
const t = require('./../translator').translate('blocks.subhead.');

function getCode() {
  return `
    <div class="cell">
      <h4 class="desc card-name">${t('text')}</h4>
    </div>`;
}

function assemble() {
  const block = wrap('subhead', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
