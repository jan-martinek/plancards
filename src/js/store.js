const fileSaver = require('file-saver');
const lzs = require('lz-string');

function wrapExport(title, data) {
  const json = JSON.stringify(data);
  const encodedJson = lzs.compressToEncodedURIComponent(json);
  const url = 'https://jan-martinek.github.io/plancards/';
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Uložená karta "${title}"</title>

    <style>
      body, html {
        background: white;
      }
      h1, h2, p {
        font-family: sans-serif;
        font-weight: normal;
      }
      h1, h2 { margin: 2rem 0 0.5rem; }
      p { margin: 0 0 1rem; }
      .wrapper {
        margin: 100px auto;
        max-width: 450px;
      }
      .box {
        padding: 2rem;
        border: 1px solid #aaa;
        background: #fafafa;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <h1>${title}</h1>
      <p>Uložená karta z aplikace „Plánovací karty“.</p>
      <div class="box">
        <p>
          Obsah karty můžete otevřít a upravovat
          <a href="${url}?entry=savedCard">na webu Plánovacích karet</a>.
        </p>

        <div id="quickLink">
          <h2>Rychlý odkaz</h2>

          <p>S trochou štěstí stačí
          <a href="${url}?cardjson=${encodedJson}">kliknout
          na odkaz</a>. Není nicméně funkční vždy — záleží
          to na prohlížeči a množství obsahu v kartě.</p>
        </div>
      </div>
    </div>

    <script>
      // long links do not work at all in IE
      // other browsers generally accept > 80k chars
      var ua = window.navigator.userAgent;
      if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0) {
        document.getElementById('quickLink').style.display = 'none';
      }
    </script>


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
  const titleFallback = 'karta';
  const contents = wrapExport(title || titleFallback, data);
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
  const today = new Date().toISOString().split('T')[0];
  fileSaver.saveAs(blob, `${title || titleFallback}-${today}.html`);
}

function exportTemplate(title, data) {
  exportCard(title || 'šablona', data);
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

function importCardFromEncodedString(string, callback) {
  callback(JSON.parse(lzs.decompressFromEncodedURIComponent(string)));
}

module.exports = {
  importCardFromFile,
  importCardFromUrl,
  importCardFromEncodedString,
  exportCard,
  exportTemplate,
};
