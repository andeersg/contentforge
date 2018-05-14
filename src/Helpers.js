const fs = require('fs');
const path = require('path');

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
  sortPostsNewest: sortPostsNewest,
  sortPostsOldest: sortPostsOldest,
};
