const fs = require('fs');
const fm = require('front-matter');
const path = require('path');
const globby = require('globby');

function jsonReadFile(path) {
  return new Promise(function(resolve, reject) {
    if (fs.existsSync(path)) {
      try {
        const content = JSON.parse(fs.readFileSync(path, 'utf8'));
        return resolve(content);
      }
      catch(e) {
        reject(`Unable to read json file: ${path}`);
      }
    }
    reject(`File does not exist: ${path}`);
  });
}

/**
 * @TODO Maybe don't split collections here. Do it while rendering.
 */
async function getPaths(path, config) {
  const filesToIgnore = [
    '!config.json',
    '!*.scss',
  ];
  const restIgnore = [
    '!_templates',
  ];

  const categories = {
    "templates": '_templates',
  };

  // for (let collection in config.collections) {
  //   categories[collection] = config.collections[collection].folder;
  //   restIgnore.push(`!${config.collections[collection].folder}`);
  // }

  const sortedPaths = {};

  for (let category in categories) {
    sortedPaths[category] = await globby([`${categories[category]}/**/*`, ...filesToIgnore], {gitignore: true});
  }
  
  sortedPaths.content = await globby(['**/*', ...filesToIgnore, ...restIgnore], {gitignore: true});

  return sortedPaths;
  // return globby(['**/*', ...filesToIgnore], {gitignore: true});
}

/**
 * Returns file paths for various things.
 */
function sortPaths(paths, config) {
  const templates = paths.filter((e) => e.startsWith('_templates'));
  const collectionPaths = {};
  for (let collection in config.collections) {

    const thisCollection = config.collections[collection].folder;
    collectionPaths[collection] = paths.filter((e) => e.startsWith(thisCollection));
  }

  return {
    templates: templates,
    collections: collectionPaths,
  };
}

function getFilenameAndExtenstion(input) {
  return path.parse(input);
}

function loadFileContent(filepath) {
  const fileContent = fs.readFileSync(filepath, 'utf8');
  const fileInfo = getFilenameAndExtenstion(filepath);
  const tplInfo = {
    name: fileInfo.name,
    ext: fileInfo.ext.replace(/^(\.)/, ''),
    path: filepath,
    attributes: {},
    content: '',
    copy: false,
  };

  if (fm.test(fileContent)) {
    const parsed = fm(fileContent);
    tplInfo.attributes = parsed.attributes;
    tplInfo.content = parsed.body;
    
  }
  else {
    // If no front-matter, we just copy file.
    tplInfo.copy = true;
  }

  return tplInfo;
}

function shouldJustMove(filepath) {
  const exts = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'pdf',
    'woff',
    'woff2',
    'css'
  ];
  let move = false;
  exts.forEach((ext) => {
    if (filepath.endsWith(ext)) {
      move = true;
    }
  });

  return move;
}

function sortPostsNewest(a, b) {
  if (a.published.unix() < b.published.unix()) {
    return 1;
  }
  if (a.published.unix() > b.published.unix()) {
    return -1;
  }
  return 0;
}

function sortPostsOldest(a, b) {
  if (a.published.unix() < b.published.unix()) {
    return -1;
  }
  if (a.published.unix() > b.published.unix()) {
    return 1;
  }
  return 0;
}

module.exports = {
  jsonReadFile: jsonReadFile,
  getPaths: getPaths,
  sortPaths: sortPaths,
  getFilenameAndExtenstion: getFilenameAndExtenstion,
  loadFileContent: loadFileContent,
  shouldJustMove: shouldJustMove,
  sortPostsNewest: sortPostsNewest,
  sortPostsOldest: sortPostsOldest,
};
