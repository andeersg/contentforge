const moment = require('moment');
const marked = require('marked');
const TitleHandler = require('../TitleHandler');
const parseDate = require('../PublishedDate');

function parseMarkdown(content, pathInfo) {
  const output = {
    title: '',
    content: '',
    excerpt: '',
    published: '',
    permalink: false,
    path: pathInfo.fullPath,
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
    // @TODO Create from markdown.
  }

  if (typeof content.attributes.permalink !== 'undefined') {
    output.permalink = content.attributes.permalink;
  }

  // @TODO Generate url based on front-matter or default config.
  // if (collection) {
  //   output.permalink = GeneratePermalink(collection.permalink, output);
  // }
  // 
  // if (typeof input.attributes.permalink !== 'undefined') {
  //   output.permalink = GeneratePermalink(content.attributes.permalink, output);
  // }

  return output;
}

module.exports = parseMarkdown;