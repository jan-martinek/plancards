const { wrap, init } = require('./util');

function getCode() {
  return `
    <div class="cell">
      <h4 class="desc card-name">Mezititulek</h4>
    </div>`;
}

function assemble() {
  const block = wrap('subhead', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
