const fs = require('fs');
const globby = require('globby');

class Analyzer {
  constructor(root, config) {
    this.projectRoot = root;
    this.config = config;

    this.analyze = this.analyze.bind(this);
    this.setIgnores = this.setIgnores.bind(this);
    this.getTemplatePaths = this.getTemplatePaths.bind(this);
    this.getCollectionPaths = this.getCollectionPaths.bind(this);
    this.getCopyFiles = this.getCopyFiles.bind(this);
    this.getPages = this.getPages.bind(this);

    this.ignoredFiles = [
      '!config.json',
      '!_site',
    ];

    this.copyExtensions = [
      'jpg',
      'jpeg',
      'gif',
      'png',
      'pdf',
      'css',
      'woff',
      'woff2',
    ];
  }
  
  setIgnores(ignores) {
    this.ignoredFiles = ignores;
  }
  
  setCopyExtensions(extensions) {
    this.copyExtensions = extensions;
  }

  /**
   * Find all paths in project. Organize them.
   *
   * @TODO Sort paths based on collection, extension++
   */
  analyze() {
    return globby(['**/*', ...this.ignoredFiles], {gitignore: true}).then((paths) => {
      return paths;
    })
    .then((paths) => {
      this.paths = paths;

      // Get templates
      const templatePaths = this.getTemplatePaths(this.paths);

      // Get collections
      const collections = this.getCollectionPaths(this.paths);

      // Get copy-files
      const copyFiles = this.getCopyFiles(this.paths);
  
      // Get the rest @TODO Should we check front-matter?
      const pages = this.getPages(this.paths);
      
      return {
        templates: templatePaths,
        collections: collections,
        copy: copyFiles,
        pages: pages,
      };
    })
    .catch((e) => {
      console.log(e);
    });
  }

  getTemplatePaths(paths) {
    const templatePaths = [];
    paths.forEach((path, i) => {
      if (path.startsWith('_templates')) {
        templatePaths.push(path);
      }
    });
    
    this.paths = paths.filter( function(el) {
      return templatePaths.indexOf(el) < 0;
    });

    return templatePaths;
  }

  getCollectionPaths(paths) {
    const collectionPaths = {};
    this.config.collections.forEach((collection) => {
      collectionPaths[collection.name] = paths.filter((path) => path.startsWith(collection.folder));
      
      this.paths = paths.filter( function(el) {
        return collectionPaths[collection.name].indexOf(el) < 0;
      });
    });

    return collectionPaths;
  }

  /**
   * Files like images and fonts should just be copied over.
   */
  getCopyFiles(paths) {
    const copyPaths = [];
    paths.forEach((path) => {
      this.copyExtensions.forEach((ext) => {
        if (path.endsWith(ext)) {
          copyPaths.push(path);
        }
      });
    });

    this.paths = paths.filter( function(el) {
      return copyPaths.indexOf(el) < 0;
    });

    return copyPaths;
  }

  /**
   * Files that should be checked for front-matter or copied to destination.
   */
  getPages(paths) {
    return paths;
  }

}
 
 module.exports = Analyzer;