const fs = require('fs-extra');

class Writer {
  constructor(root, output, config, dryRun = false) {
    this.root = root;
    this.output = output;
    this.config = config;

    this.dryRun = dryRun;

    this.write = this.write.bind(this);
    this.copyFiles = this.copyFiles.bind(this);
    this.writeFiles = this.writeFiles.bind(this);
  }

  write(data) {
    console.log('Starting writer');

    const cols = this.config.collections.map((col) => col.name);
    let handlingPromises = [];

    cols.forEach((col) => {
      const colFiles = data[col].map(this.writeFiles);
      
      handlingPromises = [...handlingPromises, ...colFiles];
    });

    const pageFiles = data.pages.map(this.writeFiles);
    
    handlingPromises = [...handlingPromises, ...pageFiles];

    const copyFiles = data.static_files.map(this.copyFiles);

    handlingPromises = [...handlingPromises, ...copyFiles];

    return fs.ensureDir(this.output)
      .then(() => {
        return Promise.all(handlingPromises);
      })
      .then(() => {
        console.log('All written and copied');
      })
      .catch((e) => {
        console.log('Error:');
        console.log(e);
      });
  }

  copyFiles(file) {
    return fs.copy(`./${file}`, `./${this.output}/${file}`)
  }

  writeFiles(file) {
    let permalink = file.permalink;
    if (permalink.endsWith('/')) {
      permalink += 'index.html';
    }

    return fs.ensureFile(`./${this.output}/${permalink}`)
      .then(() => {
        return fs.writeFile(`./${this.output}/${permalink}`, file.fileContent, 'utf8');
      });
  }
};

module.exports = Writer;
