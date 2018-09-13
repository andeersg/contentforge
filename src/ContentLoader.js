const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const globby = require('globby');
const moment = require('moment');
const slugify = require('slugify');

class ContentLoader {
  constructor(config) {
    this.scan = this.scan.bind(this);
    this.getPaths = this.getPaths.bind(this);
    this.readFrontMatterFile = this.readFrontMatterFile.bind(this);
    this.parseFilename = this.parseFilename.bind(this);
    this.isPartOFCollection = this.isPartOFCollection.bind(this);
    this.getCollectionPermalinkPattern = this.getCollectionPermalinkPattern.bind(this);
    this.renderPermalink = this.renderPermalink.bind(this);

    this.config = config;

    this.copyExtensions = [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'mp4',
      'mov',
      'css',
      'js',
      'pdf',
    ];

    this.ignoreExtensions = [
      '_*/**',
      'config.json',
      'package-lock.json',
      'package.json',
      'node_modules',
    ];

    this.content = {};
    this.collections = {};
  }

  scan() {
    const paths = this.getPaths();
    const copyRegex = new RegExp(`(${this.copyExtensions.join('|')})$`);

    paths.forEach((file) => {
      // @TODO Find out what happens to CSS file
      const pathInfo = path.parse(file);
      const fileInfo = fs.lstatSync(file, 'utf8');

      this.content[pathInfo.name] = {
        fileName: pathInfo.name,
        fileCreated: moment(fileInfo.birthtimeMs),
        modified: moment(fileInfo.mtimeMs),
        filePath: file,
        extension: pathInfo.ext,
      };

      // Read file and check for fm.
      if (file.match(copyRegex)) {
        this.content[pathInfo.name].destination = `${pathInfo.dir}/${pathInfo.base}`.replace(/^\/+/g, '');
        this.content[pathInfo.name].action = 'copy';

        return;
      }

      // Check for collection match and save that as data.
      const isCollection = this.isPartOFCollection(file);
      this.content[pathInfo.name].collection = isCollection;

      // Generate metadata for each file.
      this.content[pathInfo.name].action = 'render';

      const fm = this.readFrontMatterFile(file);

      if (!fm) {
        // Files that should be rendered must have front matter.
        // Maybe print error message?
        delete this.content[pathInfo.name];
        return;
      }

      const fromFilename = this.parseFilename(pathInfo.name);

      if (fromFilename) {
        this.content[pathInfo.name].published = fromFilename.published;
        this.content[pathInfo.name].rawTitle = fromFilename.title;
      }
      else {
        this.content[pathInfo.name].published = moment(fileInfo.birthtimeMs);
        this.content[pathInfo.name].rawTitle = pathInfo.name;
      }

      if (fm.attributes.hasOwnProperty('title')) {
        this.content[pathInfo.name].title = fm.attributes.title;
      }
      else {
        this.content[pathInfo.name].title = this.content[pathInfo.name].rawTitle.replace(/-/, ' ');
      }

      if (fm.attributes.hasOwnProperty('excerpt')) {
        this.content[pathInfo.name].excerpt = fm.attributes.excerpt;
      }

      this.content[pathInfo.name].document = fm.body;
      this.content[pathInfo.name].variables = fm.attributes;

      // @TODO Fix permalinks and collections.
      this.content[pathInfo.name].permalink = this.renderPermalink(this.content[pathInfo.name]);

      if (isCollection) {
        if (!this.collections.hasOwnProperty(isCollection)) {
          this.collections[isCollection] = [];
        }

        this.collections[isCollection].push(pathInfo.name);
      }
    });

    return {
      content: this.content,
      collections: this.collections,
    };
  }

  getPaths() {
    const patterns = ['**/*'];
    this.ignoreExtensions.forEach((ext) => {
      patterns.push(`!${ext}`);
    });

    this.config.collections.forEach((collection) => {
      patterns.push(`${collection.folder}/*`);
    });

    const paths = globby.sync(patterns);

    return paths;
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

  parseFilename(filename) {
    const parsed = filename.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})-(.*)/);
    if (parsed) {
      return {
        published: moment(`${parsed[1]}-${parsed[2]}-${parsed[3]}`, 'YYYY-MM-DD'),
        title: parsed[4],
      };
    }
    return false;
  }

  isPartOFCollection(file) {
    for (let i = 0; i < this.config.collections.length; i++) {
      const collection = this.config.collections[i];
      const colRegex = new RegExp(`^${collection.folder}`);
      
      if (file.match(colRegex)) {
        return collection.name;
      }
    }

    return false;
  }

  getCollectionPermalinkPattern(name) {
    const collection = this.config.collections.find((col) => col.name === name);

    if (!collection) {
      throw `Invalid collection name specified: ${name}`;
    }

    return collection.permalink;
  }

  renderPermalink(file) {
    const slugifySettings = {
      replacement: '-',
      lower: true,
    };

    if (typeof file.variables.permalink !== 'undefined') {
      return `${file.variables.permalink}/`;
    }

    let pattern = this.config.permalink;
    if (file.collection) {
      pattern = this.getCollectionPermalinkPattern(file.collection);
    }

    let permalink = this.replaceTimeTokens(pattern, file.published);

    if (file.fileName.match(/about/)) {
      console.log(file);
      
    }

    // @TODO This is probably a hotfix.
    if (!file.filePath.match('\/')) {
      // Root level file.
      permalink = permalink.replace(':path/', '');
    }

    // @NOTE Should we always add html suffix? rawTitle is filename without dates.
    permalink = permalink.replace(':filename', `${slugify(file.rawTitle, slugifySettings)}.html`);

    // @NOTE The title token will become "title/"
    permalink = permalink.replace(':title', `${slugify(file.rawTitle, slugifySettings)}/`);

    return permalink;
  }

  replaceTimeTokens(pattern, time) {
    return pattern
      .replace(':year', time.format('YYYY'))
      .replace(':month', time.format('MM'))
      .replace(':day', time.format('DD'));
    // @NOTE Could be possible to register custom tokens.
  }
}

module.exports = ContentLoader;
