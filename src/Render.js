const Handlebars = require('handlebars');
const fs = require('fs');
const fm = require('front-matter');
const path = require('path');
const ThemeEngine = require('./ThemeEngine');
const MarkdownTransformer = require('./Transformers/Markdown');
const HtmlTransformer = require('./Transformers/HTML');
const { sortPostsOldest } = require('./Helpers');

/**
 * Here markdown is transformed, handlebars is compiled.
 */
class Render {
  constructor(config) {
    this.config = config;

    this.handlebars = Handlebars;
    this.themeEngine = new ThemeEngine(Handlebars);
    this.templates = {};

    this.build = this.build.bind(this);
    this.prepareTemplates = this.prepareTemplates.bind(this);
    this.prepareCollections = this.prepareCollections.bind(this);
    this.preparePages = this.preparePages.bind(this);
    this.readFrontMatterFile = this.readFrontMatterFile.bind(this);
    this.processData = this.processData.bind(this);
  }

  build(data) {
    this.data = data;
    this.themeEngine.setData(data);

    return new Promise((resolve) => {
      const renderData = {
        config: this.config,
        pages: [],
      };
      this.prepareTemplates(data);
      
      this.prepareCollections(data, renderData);
      this.preparePages(data, renderData);

      resolve(renderData);
    })
    .then(this.themeEngine.render);
  }

  prepareTemplates(data) {
    data.templates.forEach((template) => {
      const pathInfo = path.parse(template);
      const fmTemplate = this.readFrontMatterFile(template);

      // fmTemplate.tpl = this.handlebars.compile(fmTemplate.body);

      this.themeEngine.setTemplate(pathInfo.name, fmTemplate);
    });
  }

  prepareCollections(data, renderData) {
    for (let col in data.collections) {
      renderData[col] = [];

      let collection = data.collections[col];

      collection.forEach((element) => {
        const processedItem = this.processData(element);
        processedItem.collection = col;
        renderData[col].push(processedItem);
      });

      renderData[col].sort(sortPostsOldest);
    }
  }

  preparePages(data, renderData) {
    data.pages.forEach((element) => {
      renderData.pages.push(this.processData(element));
    });
    
    renderData.static_files = data.copy;
  }

  readFrontMatterFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (fm.test(fileContent)) {
      const parsed = fm(fileContent);

      return parsed;
    }
    else {
      return false;
    }
  }

  /**
   * Matches files against different transformers.
   *
   * @return object
   *   A data object with variables for rendering.
   */
  processData(filePath) {
    const pathInfo = path.parse(filePath);
    const fileContent = this.readFrontMatterFile(filePath);

    pathInfo.fullPath = filePath;

    switch (pathInfo.ext) {
      case '.md':
        return MarkdownTransformer(fileContent, pathInfo);
        break;

      case '.html':
        return HtmlTransformer(fileContent, pathInfo);
        break;

      default:
    }
  }

}

module.exports = Render;