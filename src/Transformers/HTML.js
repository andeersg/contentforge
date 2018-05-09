const moment = require('moment');
const fs = require('fs');
const TitleHandler = require('../TitleHandler');
const parseDate = require('../PublishedDate');

function parseHtml(content, pathInfo) {
  const fileInfo = fs.statSync(pathInfo.fullPath);

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

  if (typeof content.attributes.permalink !== 'undefined') {
    output.permalink = content.attributes.permalink;
  }

  return output;
}

module.exports = parseHtml;