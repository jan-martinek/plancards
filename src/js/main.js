const app = require('./app');

document.addEventListener('DOMContentLoaded', () => {
  run();
});

function run() {
  preventSubmit();

  app.init();
}

function preventSubmit() {
  document.getElementById('card').addEventListener('submit', e => e.preventDefault());
}
