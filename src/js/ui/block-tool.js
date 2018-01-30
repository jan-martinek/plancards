const blocks = require('./../blocks/blocks');
const { translate } = require('./../translator');
const { allArray, findAncestor, setClasses } = require('./util');

const blockActions = {
  'swap-blocks': (button) => {
    const block = findAncestor(button, 'block');
    const previous = block.previousSibling;
    if (previous) block.parentNode.insertBefore(block, previous);
  },
  'remove-block': (button) => {
    const block = findAncestor(button, 'block');
    block.remove();
  },
  'add-block': (button) => {
    if (button.classList.contains('opened')) {
      findAncestor(button, 'block-tools').querySelector('.add-block-tool').remove();
      button.classList.remove('opened');
    } else {
      const tools = findAncestor(button, 'block-tools');
      tools.insertAdjacentElement('beforeend', createAddBlockTool());
      button.classList.add('opened');
    }
  },
  'add-block-type': (button) => {
    const block = findAncestor(button, 'block');
    const newBlock = blocks.create(button.dataset.type);
    block.insertAdjacentElement('beforebegin', newBlock);
    allArray(newBlock, '.desc').forEach((el) => {
      el.setAttribute('contenteditable', 'true');
    });
    findAncestor(button, 'block-tools').querySelector('.add-block').classList.remove('opened');
    findAncestor(button, 'add-block-tool').remove();
  },
};

function trigger(e) {
  const target = e.target.classList.contains('tool')
    ? e.target
    : e.target.parentNode.classList.contains('tool')
      ? e.target.parentNode
      : null;

  if (target) {
    Object.keys(blockActions).forEach((key) => {
      if (target.classList.contains(key)) blockActions[key](target);
    });
  }
}

function createAddBlockTool() {
  const addBlockTool = document.createElement('DIV');
  addBlockTool.classList.add('add-block-tool');
  addBlockTool.innerHTML = '<div class="arrow-up"></div><div class="content grid-x grid-margin-x"></div>';
  const content = addBlockTool.querySelector('.content');

  Object.keys(blocks.nav).forEach((navGroup) => {
    const fragment = document.createDocumentFragment();
    const section = document.createElement('section');

    setClasses(section, ['cell', 'medium-4']);
    section.innerHTML = `<p>${translate('blockNav', navGroup)}</p>`;
    fragment.appendChild(section);

    blocks.nav[navGroup].forEach((key) => {
      if (key === '---') {
        section.appendChild(document.createElement('HR'));
      } else {
        const blockLink = document.createElement('A');
        setClasses(blockLink, ['tool', 'add-block-type']);
        blockLink.dataset.type = key;
        blockLink.innerHTML = translate('blocks', key, 'name');
        section.appendChild(blockLink);
      }
    });

    content.appendChild(fragment);
  });

  return addBlockTool;
}

module.exports = {
  trigger,
};
