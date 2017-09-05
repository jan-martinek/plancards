const { wrap } = require('./util');

function assemble() {
  return wrap('separator', '<div class="cell"><hr></div>');
}


module.exports = { assemble };
