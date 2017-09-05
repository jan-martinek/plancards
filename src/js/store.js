const fileSaver = require('file-saver');

function wrapExport(title, data) {
  const json = JSON.stringify(data);
  const url = 'https://jan-martinek.github.io/plancards/';
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Uložená karta "${title}"</title>
  </head>
  <body>
    <h1>Toto je uložená karta "${title}".</h1>
    <p>
      Obsah karty můžete otevřít a upravovat
      <a href="${url}">na webu Plánovacích karet</a>.
    </p>
    <!-- !!!${json}!!! -->
  </body>
  </html>`;
}

function unwrapExport(html) {
  const matches = /<!-- !!!([\S\s]+)!!! -->/.exec(html);
  if (matches) return JSON.parse(matches[1]);
  return false;
}

function exportCard(title, data) {
  const contents = wrapExport(title, data);
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
  const today = new Date().toISOString().split('T')[0];
  fileSaver.saveAs(blob, `${title}-${today}.html`);
}

function importCardFromFile(file, callback) {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = e => callback(unwrapExport(e.target.result));
}

function importCardFromUrl(url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.send();
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      callback(unwrapExport(request.responseText));
    }
  };
}


module.exports = { importCardFromFile, importCardFromUrl, exportCard };
