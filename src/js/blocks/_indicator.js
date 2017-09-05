const { wrap, init } = require('./util');
const { read } = require('./../fields/fields');

function update(el) {
  if (read(el.querySelector('.bool'))) {
    el.classList.add('true');
  } else {
    el.classList.remove('true');
  }
}

const code = `
<div class="cell is-true">
  <p class="icon"><i class="fa fa-check" aria-hidden="true"></i></p>
  <p class="desc">Text, pokud je podmínka splněna</p>
</div>
<div class="cell is-false">
  <p class="icon"><i class="fa fa-times" aria-hidden="true"></i></p>
  <p class="desc">Text, pokud podmínka není splněna</p>
</div>
<div class="cell hide-in-fill-mode"><input type="text" class="out name formula bool"></div>`;

function assemble() {
  const block = wrap('indicator', `${code}`);
  init(block, update);
  return block;
}


module.exports = { assemble, update };
