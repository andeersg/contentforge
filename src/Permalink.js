function GeneratePermalink(input, context) {
  let filename = false;
  if (input.match(/:filename/)) {
    filename = true;
  }
  
  let generated = input
    .replace(':year', context.published.format('YYYY'))
    .replace(':month', context.published.format('MM'))
    .replace(':day', context.published.format('DD'))
    .replace(':filename', context.rawTitle.toLowerCase())
    .replace(':path', context.path) // @TODO must remove filename.
    .replace(':title', context.title.replace(/ /, '_').toLowerCase());

  if (filename) {
    generated += `.${context.ext}`;
  }
  else {
    // @TODO what about none html files?
    generated += '/index.html';
  }

  return generated;
}

module.exports = GeneratePermalink;
