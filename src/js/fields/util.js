function activate(el, fieldName) {
  const wrapper = cel('DIV', ['key-wrapper', 'input-group']);

  // wrapper.appendChild(type);
  if (el.classList.contains('name')) {
    const label = cel('SPAN', ['input-group-label'], '<i class="fa fa-tag" aria-hidden="true"></i>');
    wrapper.appendChild(label);
    const name = cel('INPUT', ['name-setter', 'input-group-field']);
    name.addEventListener('input', () => nameInput(el, name.value));
    name.setAttribute('placeholder', 'název');
    wrapper.appendChild(name);
  }
  if (el.classList.contains('out')) {
    el.setAttribute('readonly', 'readonly');
  }
  if (el.classList.contains('formula')) {
    const label = cel('SPAN', ['input-group-label'], '&fnof;');
    wrapper.appendChild(label);
    const formula = cel('INPUT', ['formula-setter', 'input-group-field']);
    formula.addEventListener('input', () => appendFormula(el, formula.value));
    formula.setAttribute('placeholder', 'vzorec');
    wrapper.appendChild(formula);
    el.setAttribute('readonly', 'readonly');
  }
  el.dataset.fieldName = fieldName;
  el.insertAdjacentElement('afterend', wrapper);
}

function cel(name, classNames, html) {
  const el = document.createElement(name);
  if (classNames) el.setAttribute('class', classNames.join(' '));
  if (html) el.innerHTML = html;
  return el;
}

function nameInput(el, name) {
  el.setAttribute('name', name);
}

function appendFormula(el, formula) {
  el.dataset.formula = formula;
}


module.exports = { activate };
