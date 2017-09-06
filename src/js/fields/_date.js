const moment = require('moment');
const Pikaday = require('pikaday');

const { activate } = require('./util');
const t = require('./../translator').translate;

function init(el) {
  activate(el, 'date');
  decorate(el);
}

function decorate(el) {
  if (el.classList.contains('in')) {
    new Pikaday({
      field: el,
      format: t('dateFormat'),
      firstDay: 1,
      onSelect: () => el.dispatchEvent(new Event('input')),
      i18n: t('pikadayNames'),
    });
  }
}

function read(el) {
  return moment(el.value, t('dateFormat'));
}

function write(el, val) {
  if (typeof val === 'string') {
    el.value = moment(val).format(t('dateFormat'));
  } else if (typeof val === 'object' && val.format === moment.prototype.format) {
    el.value = val.format(t('dateFormat'));
  }
}


module.exports = { init, read, write };
