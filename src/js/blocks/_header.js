const { wrap, init } = require('./util');
const t = require('./../translator').translate('blocks.header.');

function getCode() {
  return `
    <div class="cell medium-6 card-info">
      <h4 class="desc card-name">${t('title')}</h4>
      <p class="desc">${t('short')}</p>
    </div>
    <div class="cell medium-6 card-info">
      <h4>${t('authorHeading')}</h4>
      <p class="desc">${t('author')}</p>
      <h4>${t('licenseHeading')}</h4>
      <p class="desc">${t('license')}</p>
    </div>
    <div class="cell">
      <p><label class="desc">${t('activityName')}</label>
        <input name="_activity-name" type="text" class="in text">
      </label></p>
    </div>
    <div class="cell medium-6">
      <p><label>
        ${t('goal')}<br>
        <textarea class="in text"></textarea>
      </label></p>
    </div>
    <div class="cell medium-6">
      <p><label>
        ${t('notes')}<br>
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
