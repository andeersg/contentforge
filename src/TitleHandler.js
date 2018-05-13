function TitleHandler(content, pathInfo) {
  if (pathInfo.name.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)/)) {
    const filenameParts = pathInfo.name.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)/);
    const rawTitle = filenameParts[4].replace(/-/g, ' ');

    if (typeof content.attributes.title !== 'undefined') {
      return content.attributes.title;
    }

    return rawTitle;
  }
  else {
    if (typeof content.attributes.title !== 'undefined') {
      return content.attributes.title;
    }

    return capitalizeFirstLetter(pathInfo.name.replace(/-/g, '').replace(/_/g, ' '));
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = TitleHandler;
