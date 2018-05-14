const moment = require('moment');
const TitleHandler = require('../TitleHandler');
const parseDate = require('../PublishedDate');
const generateExcerpt = require('../generateExcerpt');

function parseHtml(content, pathInfo) {
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
    front: (pathInfo.fullPath == 'index.html' ? true : false),
  };

  output.title = TitleHandler(content, pathInfo);
  output.published = parseDate(content, pathInfo);

  output.content = content.body;

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

module.exports = parseHtml;