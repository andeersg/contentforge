const resolvePermalink = require('./Permalink');

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

    this.handlebars.registerHelper('json', function(context) {
      return JSON.stringify(context);
    });

    this.handlebars.registerHelper('date', function(context) {
      return context.format('MMMM DD, Y');
    });
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
        
        colItem.collection = col;
        colItem.rendered = tpl(context);
      });
    });

    renderData.pages.forEach((colItem) => {
      const context = Object.assign({}, {site: renderData}, {page: colItem});
      const tpl = this.handlebars.compile(colItem.content);
      
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
        colItem.permalink = this.resolvePermalink(colItem, context);
      });
    });
    
    renderData.pages.forEach((colItem) => {
      const context = Object.assign({}, {site: renderData}, {page: colItem}, {content: colItem.rendered});
      const layout = this.resolveLayout(colItem.variables.layout);

      colItem.fileContent = this.renderLayout(layout, context);
      colItem.permalink = this.resolvePermalink(colItem, context);
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