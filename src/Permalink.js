function GeneratePermalink(input, item) {
  if (item.permalink && !item.permalink.endsWith('.html')) {
    return `${item.permalink}/index.html`;
  }

  if (item.path == 'index.html') {
    return 'index.html';
  }

  let filename = false;
  if (input.match(/:filename/)) {
    filename = true;
  }

  let generated = input
    .replace(':year', item.published.format('YYYY'))
    .replace(':month', item.published.format('MM'))
    .replace(':day', item.published.format('DD'))
    .replace(':filename', item.filename)
    .replace(':path', item.path) // @TODO must remove filename.
    .replace(':title', item.title.replace(/ /, '_').toLowerCase())
    .replace(':ext', item.extension);

  if (filename) {
    generated += `.${item.extension}`;
  }
  else {
    generated += '/index.html';
  }

  return generated;
}

module.exports = GeneratePermalink;
