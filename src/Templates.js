/**
 * @file
 * Reads the source folder.
 */

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const fm = require('front-matter');
const handlebars = require('handlebars');

class Templates {
  constructor() {
    this.loadTemplates = this.loadTemplates.bind(this);
    this.loadPartials = this.loadPartials.bind(this);
    this.readFrontMatterFile = this.readFrontMatterFile.bind(this);

    this.tpl = {};
  }

  /**
   * Load templates into system.
   * @param {string} templateLocation 
   */
  loadTemplates(templateLocation) {
    const paths = globby.sync(templateLocation, {gitignore: true});
    paths.forEach(p => {
      const content = this.readFrontMatterFile(p);
      const info = path.parse(p);

      // @NOTE All templates should have front matter.
      if (content) {
        this.tpl[info.name] = {
          attributes: content.attributes,
          template: handlebars.compile(content.body),
        };
      }
    });

    return paths;
  }

  loadPartials() {
    console.warn('Not implemented yet.');
  }

  initiateTemplates() {
    const templatePaths = '_templates';
    const partialsPaths = '_partials';

    this.loadTemplates(templatePaths);

    return this.tpl;
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
}

module.exports = Templates;
