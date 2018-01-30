const fileSaver = require('file-saver');
const lzs = require('lz-string');
const t = require('./translator').translate;

function wrapExport(title, data) {
  const json = JSON.stringify(data);
  const encodedJson = lzs.compressToEncodedURIComponent(json);
  const url = 'https://jan-martinek.github.io/plancards/';
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${t('export.storedCard')} „${title}“</title>

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
      <p>${t('export.storedCardLong')}</p>
      <div class="box">
        <p>
          ${t('export.usage')}
          <a href="${url}?entry=savedCard">${t('export.usageLoc')}</a>.
        </p>

        <div id="quickLink">
          <h2>${t('export.quickLink')}</h2>
          <p>
            ${t('export.luck')}
            <a href="${url}?cardjson=${encodedJson}">${t('export.click')}</a>.
            ${t('export.depends')}
          </p>
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
  const titleFallback = t('export.quickLink');
  const contents = wrapExport(title || titleFallback, data);
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
  const today = new Date().toISOString().split('T')[0];
  fileSaver.saveAs(blob, `${title || titleFallback}-${today}.html`);
}

function exportTemplate(title, data) {
  exportCard(title || t('export.template'), data);
}

function importFromFile(file, callback) {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = e => callback(unwrapExport(e.target.result));
}

function urlImport(query, callback) {
  if (query.cardurl) {
    importFromUrl(query.cardurl, callback);
  } else if (query.cardjson) {
    importFromEncodedString(query.cardjson, callback);
  }
}

function importFromUrl(url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.send();
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      callback(unwrapExport(request.responseText));
    }
  };
}

function importFromEncodedString(string, callback) {
  callback(JSON.parse(lzs.decompressFromEncodedURIComponent(string)));
}

module.exports = {
  importFromFile,
  urlImport,
  exportCard,
  exportTemplate,
};
