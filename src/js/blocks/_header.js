const { wrap, init } = require('./util');

function getCode() {
  return `
    <div class="cell medium-6 card-info">
      <h4 class="desc card-name">Nadpis karty</h4>
      <p class="desc">Krátce popište, k čemu se tato karta hodí.</p>
    </div>
    <div class="cell medium-6 card-info">
      <h4>Autor/ka karty</h4>
      <p class="desc">Jméno Příjmení, jmeno.prijmeni@email.cz</p>
      <h4>Licence (pravidla pro sdílení)</h4>
      <p class="desc">Zde krátce popište, zda kartu sdílíte volně
      nebo zda žádáte o dodržení nějakých pravidel (např. ponechání
      kontaktu na původního autora atp. Můžete
      určit i konkrétní licenci (například Creative Commons).</p>
    </div>
    <div class="cell">
      <p><label class="desc">Název aktivity</label>
        <input name="_activity-name" type="text" class="in text">
      </label></p>
    </div>
    <div class="cell medium-6">
      <p><label>
        Cíl aktivity v jedné větě<br>
        <textarea class="in text"></textarea>
      </label></p>
    </div>
    <div class="cell medium-6">
      <p><label>
        Poznámky<br>
        <textarea class="in text"></textarea>
      </label></p>
    </div>`;
}

function assemble() {
  const block = wrap('header', getCode());
  init(block);
  return block;
}


module.exports = { assemble };
