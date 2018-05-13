const resolvePermalink = require('./Permalink');
const handlebarHelpers = require('./handlebarHelpers');

class ThemeEngine {
  constructor(handlebars, data) {
    this.handlebars = handlebars;
    this.templates = {};

    this.render = this.render.bind(this);
    this.setTemplate = this.setTemplate.bind(this);
    this.setData = this.setData.bind(this);
    this.prepareContent = this.prepareContent.bind(this);
    this.renderLayouts = this.renderLayouts.bind(this);
    this.renderLayout = this.renderLayout.bind(this);
    this.resolveLayout = this.resolveLayout.bind(this);
    this.resolvePermalink = this.resolvePermalink.bind(this);

    handlebarHelpers(this.handlebars);
  }

  setTemplate(name, template) {
    this.templates[name] = {
      tpl: this.handlebars.compile(template.body),
      variables: template.attributes,
    };
  }
  
  setData(data) {
    this.data = data;
  }

  render(renderData) {
    this.prepareContent(renderData);
    this.renderLayouts(renderData);


    return renderData;
  }

  prepareContent(renderData) {
    const cols = Object.keys(this.data.collections);

    cols.forEach((col) => {
      renderData[col].forEach((colItem) => {
        const context = Object.assign({}, {site: renderData}, {page: colItem});
        const tpl = this.handlebars.compile(colItem.content);

        colItem.permalink = this.resolvePermalink(colItem, context);

        colItem.collection = col;
        try {
          colItem.rendered = tpl(context);
        }
        catch (e) {
          console.log(e);
          console.log(colItem.title);
        }
      });
    });

    renderData.pages.forEach((colItem) => {
      const context = Object.assign({}, {site: renderData}, {page: colItem});

      context.is_front = colItem.front; // @TODO Create a function or something for these.

      const tpl = this.handlebars.compile(colItem.content);

      colItem.permalink = this.resolvePermalink(colItem, context);

      colItem.rendered = tpl(context);
    });

    return renderData;
  }

  renderLayouts(renderData) {
    const cols = Object.keys(this.data.collections);

    cols.forEach((col) => {
      renderData[col].forEach((colItem, i) => {
        const context = Object.assign({}, {site: renderData}, {page: colItem}, {content: colItem.rendered});
        const layout = this.resolveLayout(colItem.variables.layout);

        colItem.fileContent = this.renderLayout(layout, context);
      });
    });
    
    renderData.pages.forEach((colItem) => {
      const context = Object.assign({}, {site: renderData}, {page: colItem}, {content: colItem.rendered});
      context.is_front = colItem.front;
      const layout = this.resolveLayout(colItem.variables.layout);

      colItem.fileContent = this.renderLayout(layout, context);
    });
  }
  
  renderLayout(layout, context) {
    const rendered = this.templates[layout].tpl(context);
    if (typeof this.templates[layout].variables.layout !== 'undefined') {
      const innerContext = Object.assign({}, context, {content: rendered});

      return this.renderLayout(this.templates[layout].variables.layout, innerContext);
    }
    return rendered;
  }

  resolveLayout(name) {
    if (typeof this.templates[name] === 'undefined') {
      return 'default';
    }
    return name;
  }

  resolvePermalink(item, context) {
    let permalinkTemplate = context.site.config.permalink;
    
    if (item.collection) {
      const thisCollection = context.site.config.collections.find((col) => col.name == item.collection);
      permalinkTemplate = thisCollection.permalink;
    }

    return resolvePermalink(permalinkTemplate, item);
  }
}

module.exports = ThemeEngine;