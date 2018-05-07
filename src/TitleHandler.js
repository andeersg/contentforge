function TitleHandler(content, pathInfo) {
  if (pathInfo.name.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)/)) {
    const filenameParts = pathInfo.name.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)/);
    const rawTitle = filenameParts[4].replace(/-/, ' ');

    if (typeof content.attributes.title !== 'undefined') {
      return content.attributes.title;
    }

    return rawTitle;
  }
  else {
    if (typeof content.attributes.title !== 'undefined') {
      return content.attributes.title;
    }

    return pathInfo.name.replace(/-/, '').replace(/_/, ' ');
  }
}

module.exports = TitleHandler;
