const moment = require('moment');
const fs = require('fs');

function parseDate(content, pathInfo) {
  // If a date is defined in front-matter, that wins.
  if (typeof content.attributes.published !== 'undefined') {
    return moment(content.attributes.published, "YYYY-MM-DD");
  }

  if (pathInfo.name.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)/)) {
    const filenameParts = pathInfo.name.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)/);
    return moment(`${filenameParts[1]}-${filenameParts[2]}-${filenameParts[3]}`, "YYYY-MM-DD");
  }
  else {
    const fileInfo = fs.statSync(pathInfo.fullPath);
    return moment(fileInfo.birthtimeMs);
  }
}

module.exports = parseDate;
