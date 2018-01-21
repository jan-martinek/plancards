const t = require('./../translator').translate('fields.util.');

function activate(el, fieldName) {
  el.dataset.fieldName = fieldName;

  const showsOutput = el.classList.contains('out') || el.classList.contains('formula');
  if (showsOutput) el.setAttribute('readonly', 'readonly');

  const descriptors = createDescriptors(el);
  if (descriptors) el.insertAdjacentElement('afterend', descriptors);
}


function createDescriptors(el) {
  let name;
  let formula;

  const descriptors = createElement('DIV', ['descriptors']);

  if (el.classList.contains('name')) {
    name = createDescriptor('name', '<i class="fa fa-tag" aria-hidden="true"></i>', nameInput, el);
    descriptors.appendChild(name);
  }

  if (el.classList.contains('formula')) {
    formula = createDescriptor('formula', '&fnof;=', appendFormula, el);
    descriptors.appendChild(formula);
  }

  return (formula || name) ? descriptors : null;
}

function createDescriptor(type, labelHtml, listener, input) {
  const descriptor = createElement('SPAN', ['descriptor', `${type}-descriptor`]);

  const label = createElement('SPAN', ['descriptor-label'], labelHtml);
  descriptor.appendChild(label);

  const field = createElement('INPUT', ['descriptor-value', `${type}-setter`]);
  field.addEventListener('input', () => listener(input, field.value));
  field.setAttribute('placeholder', t(type));
  descriptor.appendChild(field);

  return descriptor;
}


function createElement(name, classNames, html) {
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
