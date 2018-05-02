function HTMLFiles(input, templates, hb) {
  console.log(input);
  console.log(templates);
  
  const template = Handlebars.compile(templates[input.attributes.layout]);
  const rendered = template(input.content);

  return {};
}

module.exports = HTMLFiles;
