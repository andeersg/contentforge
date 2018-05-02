const fs = require('fs');
const fm = require('front-matter');
const Handlebars = require('handlebars');
const { getFilenameAndExtenstion, loadFileContent, shouldJustMove } = require('./Helpers');
const MarkdownHandler = require('./Types/Markdown');
const StaticFileHandler = require('./Types/StaticFile');
const HTMLFilesHandler = require('./Types/HTMLFiles');

class Writer {
  constructor(paths, config, output) {
    this.paths = paths;
    this.config = config;
    this.output = output;
  
    this.handlebars = Handlebars;

    this.prepareTemplates = this.prepareTemplates.bind(this);
    this.prepareContent = this.prepareContent.bind(this);
    this.isPartOfCollection = this.isPartOfCollection.bind(this);
  }

  write() {
    console.log('Starting writer');
    this.templates = this.prepareTemplates();

    this.data = this.prepareContent();
  }

  prepareTemplates() {
    const tpls = {};
    this.paths.templates.forEach(function(path) {
      const fileContent = loadFileContent(path);
      
      const fileInfo = getFilenameAndExtenstion(path);

      tpls[fileInfo.name] = fileContent;
    });
    // @TODO Run them through handlebars here.

    return tpls;
  }

  prepareContent() {
    const data = {
      site: {
        files: [],
        // Other global stuff.
      }
    };
    
    this.config.collections.forEach((col) => {
      data.site[col.name] = [];
    });

    console.log(this.paths.content);

    this.paths.content.forEach((path) => {
      // @TODO We need a direct copy check. Images, fonts and other stuff should be copied without reading.
      if (shouldJustMove(path)) {
        const fileInfo = getFilenameAndExtenstion(path);
  
        data.site.files.push({
          name: fileInfo.name,
          filename: fileInfo.base,
          path: `${fileInfo.dir}/${fileInfo.base}`,
        });
      }
      else {
        const content = loadFileContent(path);
        const collection = this.isPartOfCollection(path, this.config.collections);

        let parsedFile;

        switch (content.ext) {
          case 'md':
            parsedFile = MarkdownHandler(content, collection); // @NOTE Maybe provide permalink structure, instead.
            data.site[collection.name].push(parsedFile);
            break;

          case 'html':
            parsedFile = HTMLFilesHandler(content, this.templates, this.handlebars);
            break;

          default:
            parsedFile = StaticFileHandler(content);
        }
      }
    });

    // We need collection folders for identification.
    // Go through all files, check for front-matter
    // If front-matter is not found copy to same location.
    // If front-matter is found, determine permalink and render.

    // Have a module to prepare different kinds of content for output.
    // console.log(JSON.stringify(data));
  }

  isPartOfCollection(path, collections) {
    let collection = false;
    collections.forEach((co) => {
      if (path.startsWith(co.folder)) {
        collection = co;
      }
    });

    return collection;
  }

};

module.exports = Writer;