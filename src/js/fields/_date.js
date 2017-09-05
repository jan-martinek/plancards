const { activate } = require('./util');
const moment = require('moment');
const Pikaday = require('pikaday');

function init(el) {
  activate(el, 'date');
  decorate(el);
}

function decorate(el) {
  if (el.classList.contains('in')) {
    new Pikaday({
      field: el,
      format: 'D. M. YYYY',
      firstDay: 1,
      onSelect: () => el.dispatchEvent(new Event('input')),
      i18n: {
        previousMonth: 'Předchozí měsíc',
        nextMonth: 'Následující měsíc',
        months: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
        weekdays: ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'],
        weekdaysShort: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
      },
    });
  }
}

function read(el) {
  return moment(el.value, 'D. M. YYYY');
}

function write(el, val) {
  if (typeof val === 'string') {
    el.value = moment(val).format('D. M. YYYY');
  } else if (typeof val === 'object' && val.format === moment.prototype.format) {
    el.value = val.format('D. M. YYYY');
  }
}


module.exports = { init, read, write };
