function GeneratePermalink(input, item) {
  if (item.permalink && !item.permalink.endsWith('.html')) {
    return `${item.permalink}/`;
  }

  if (item.path == 'index.html') {
    return '/';
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
    .replace(':path', item.path)
    .replace(':title', item.title.replace(/ /, '_').toLowerCase())
    .replace(':ext', item.extension);

  if (filename) {
    generated += `.${item.extension}`;
  }
  else {
    generated += '/';
  }

  return generated;
}

module.exports = GeneratePermalink;
