const ui = require('./ui');

document.addEventListener('DOMContentLoaded', () => {
  run();
});

function run() {
  preventSubmit();

  ui.init();
}

function preventSubmit() {
  document.getElementById('card').addEventListener('submit', e => e.preventDefault());
}
