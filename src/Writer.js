const moment = require('moment');
const handlebars = require('handlebars');
const fs = require('fs-extra');
const handlebarHelpers = require('./handlebarHelpers');

class Writer {
  constructor(config, tpl) {
    this.addContent = this.addContent.bind(this);
    this.prepareVariables = this.prepareVariables.bind(this);
    this.prepareCollections = this.prepareCollections.bind(this);
    this.renderElement = this.renderElement.bind(this);
    this.copyElement = this.copyElement.bind(this);
    this.renderInTemplate = this.renderInTemplate.bind(this);
    this.writeFile = this.writeFile.bind(this);

    this.config = config;
    this.tpl = tpl;

    // Register helpers.
    handlebarHelpers(handlebars);
  }

  addContent(data) {
    this.content = data.content;
    this.collections = data.collections;
  }

  prepareVariables() {
    const data = {
      now: moment().unix(),
      ...this.config,
    };

    return {
      site: data,
    };
  }

  prepareCollections(variables) {
    // Prepare the collections, order by publish
    Object.keys(this.collections).forEach(collectionName => {
      variables.site[collectionName] = [];

      // Add the posts to the site variable for loops and such.
      this.collections[collectionName].forEach(postTitle => {
        variables.site[collectionName].push({
          title: this.content[postTitle].title,
          published: this.content[postTitle].published,
          description: 'Description to come',
        });
      });
    });
    
  }

  write() {
    // @TODO Prepare variables
    const vars = this.prepareVariables();
    this.prepareCollections(vars);
    
    // @TODO Loop through content and render/write to output.
    for (let i in this.content) {
      const item = this.content[i];

      if (item.action === 'copy') {
        this.copyElement(item);
      }
      else if (item.action === 'render') {
        this.renderElement(item, vars, this.content);
      }

      // const context = Object.assign({}, {site: renderData}, {page: colItem});
      // const tpl = handlebars.compile(colItem.content);
    }
  }

  /**
   * Compile a document with layouts.
   * @param {object} item 
   * @param {object} variables 
   * @param {object} content 
   */
  renderElement(item, variables, content) {
    const tpl = handlebars.compile(item.document);
    const pageVariables = Object.assign({}, variables);
    pageVariables.page = item;

    // This is a function where we send in variables to render it.
    const renderedContent = tpl(pageVariables);
    let templateName = item.variables.layout;

    if (templateName == null) {
      templateName = 'default';
    }
  
    const rendered = this.renderInTemplate(renderedContent, pageVariables, templateName);

    this.writeFile(rendered, item.permalink);
  }

  copyElement(item) {
    fs.copySync(item.filePath, `_site/${item.destination}`);
  }

  renderInTemplate(content, pageVariables, layoutName) {
    const tpl = this.tpl.tpl[layoutName];

    if (typeof tpl.attributes.layout !== 'undefined') {
      const rendered = tpl.template({content: content, ...pageVariables});

      return this.renderInTemplate(rendered, pageVariables, tpl.attributes.layout);
    }

    return tpl.template({content: content, ...pageVariables});
  }

  writeFile(content, path) {
    fs.outputFileSync(`_site/${path}`, content);
  }

}

module.exports = Writer;
