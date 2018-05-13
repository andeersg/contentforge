const moment = require('moment');
const marked = require('marked');
const TitleHandler = require('../TitleHandler');
const parseDate = require('../PublishedDate');
const generateExcerpt = require('../generateExcerpt');

function parseMarkdown(content, pathInfo) {
  const output = {
    title: '',
    content: '',
    excerpt: '',
    published: '',
    permalink: false,
    path: pathInfo.dir,
    filename: pathInfo.name.replace(/^([0-9]{4}-[0-9]{2}-[0-9]{2}-)/, ''),
    extension: 'html',
    variables: content.attributes,
    collection: false,
  };

  output.title = TitleHandler(content, pathInfo);
  output.published = parseDate(content, pathInfo);

  output.content = marked(content.body);

  if (typeof content.attributes.excerpt !== 'undefined') {
    output.excerpt = content.attributes.excerpt;
  }
  else {
    output.excerpt = generateExcerpt(output.content, 80);
  }

  if (typeof content.attributes.permalink !== 'undefined') {
    output.permalink = content.attributes.permalink;
  }

  return output;
}

module.exports = parseMarkdown;