const { wrap, init } = require('./util');
const { read, write } = require('./../fields/fields');

function update(el) {
  const rows = [].slice.call(el.querySelectorAll('.row'));
  const total = rows.reduce((acc, row) => {
    const price = read(row.querySelector('.price'));
    const units = read(row.querySelector('.units'));
    write(row.querySelector('.subtotal'), price * units);
    return acc + (price * units);
  }, 0);
  write(el.querySelector('.total'), total);
  hideEmpty(el.querySelectorAll('.pricelist-item'));
}

function hideEmpty(items) {
  let lastEmpty = false;
  [].slice.call(items).forEach((item) => {
    const values = item.querySelectorAll('input');
    const empty = values[0].value === '' && values[1].value === '' && values[2].value === '';
    if (lastEmpty && empty) {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
    lastEmpty = empty;
  });
}
const header = `<div class="cell"><div class="pricelist-header grid-x">
    <div class="cell medium-6"><p class="desc">Položka</p></div>
    <div class="cell medium-2"><p class="desc">Cena</p></div>
    <div class="cell medium-2"><p class="desc">Počet</p></div>
    <div class="cell medium-2"><p class="desc">Celkem</p></div>
  </div></div>`;
const row = `<div class="row grid-x pricelist-item">
    <div class="cell medium-6"><input type="text" class="in text"></div>
    <div class="cell medium-2"><input type="text" class="in number price"></div>
    <div class="cell medium-2"><input type="text" class="in number units"></div>
    <div class="cell medium-2"><input type="text" class="out number subtotal"></div>
  </div>`;
const totals = `<div class="totals grid-x">
    <div class="cell medium-6"><p class="desc">Celkem</p></div>
    <div class="cell medium-6"><input type="text" class="out name number total"></div>
  </div>`;

function assemble() {
  const block = wrap('pricelist', `${header} <div class="cell">${row.repeat(10)} ${totals}</div>`);
  init(block, update);
  return block;
}


module.exports = { assemble, update };
