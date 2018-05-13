const assert = require('assert');
const TitleHandler = require('../src/TitleHandler');

const item1 = {
  content: {
    attributes: {},
  },
  pathInfo: {
    name: '2018-05-22-Titles-are-cool',
  }
}
const item2 = {
  content: {
    attributes: {
      title: 'A better title',
    },
  },
  pathInfo: {
    name: '2018-05-22-Titles-are-cool',
  }
}
const item3 = {
  content: {
    attributes: {},
  },
  pathInfo: {
    name: 'about',
  }
}
const item4 = {
  content: {
    attributes: {
      title: 'Aaaaabout'
    },
  },
  pathInfo: {
    name: 'about',
  }
}

describe('TitleHandler', function() {
  it('should strip date and return formated filename', function() {
    assert.equal(TitleHandler(item1.content, item1.pathInfo), 'Titles are cool');
  });
  it('should use title from attributes if defined', function() {
    assert.equal(TitleHandler(item2.content, item2.pathInfo), 'A better title');
  });
  it('should prepare filename if a regular file', function() {
    assert.equal(TitleHandler(item3.content, item3.pathInfo), 'About');
  });
  it('should prefer title in attributes for all files', function() {
    assert.equal(TitleHandler(item4.content, item4.pathInfo), 'Aaaaabout');
  });
});