const marked = require('marked');
const moment = require('moment');
const GeneratePermalink = require('../Permalink');

function MarkdownHandler(input, collection) {
  const output = {
    path: input.path,
    published: null,
    title: '',
    content: '',
    excerpt: '',
    rawTitle: '',
    ext: 'html',
    attributes: {},
    permalink: '',
  };

  const filenameParts = input.name.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)/);

  output.published = moment(`${filenameParts[1]}-${filenameParts[2]}-${filenameParts[3]}`, "YYYY-MM-DD");

  output.rawTitle = filenameParts[4];

  output.title = output.rawTitle.replace(/-/, ' ');

  if (typeof input.attributes.title !== 'undefined') {
    output.title = input.attributes.title;
  }

  if (typeof input.attributes.published !== 'undefined') {
    output.published = moment(input.attributes.published, "YYYY-MM-DD");
  }

  output.content = marked(input.content);

  if (typeof input.attributes.excerpt !== 'undefined') {
    output.excerpt = input.attributes.excerpt;
  }
  else {
    // @TODO Create from markdown.
  }

  // @TODO Generate url based on front-matter or default config.
  if (collection) {
    output.permalink = GeneratePermalink(collection.permalink, output);
  }

  if (typeof input.attributes.permalink !== 'undefined') {
    output.permalink = GeneratePermalink(input.attributes.permalink, output);
  }

  return output;
}


module.exports = MarkdownHandler;