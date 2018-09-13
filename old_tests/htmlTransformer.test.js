const assert = require('assert');
const mock = require('mock-fs');
const HTMLTransformer = require('../src/Transformers/HTML');

const content = {
  content: '<p>This is content, it is useful for websites.</p>',
  attributes: {},
};

const pathInfo = {
  name: 'about',
  dir: 'pages',
  fullPath: 'pages/about.html',
};

describe('HTMLTransformer', function() {
  before(function() {
    mock({
      'pages/about.html': '<p>This is content, it is useful for websites.</p>',
      'index.html': 'Frontpage',
    });
  });


  it('should return a object', function() {
    const thisContent = Object.assign({}, content);
    const thisPathInfo = Object.assign({}, pathInfo);
    
    const htmlData = HTMLTransformer(thisContent, thisPathInfo);
    assert.equal(typeof htmlData, 'object');
  });

  it('should use the predefined excerpt if it exists', function() {
    const thisContent = Object.assign({}, content, {attributes: {excerpt: 'My custom excerpt'}});
    const thisPathInfo = Object.assign({}, pathInfo);
    
    const htmlData = HTMLTransformer(thisContent, thisPathInfo);
    assert.equal(htmlData.excerpt, 'My custom excerpt');
  });

  it('should use the predefined permalink if it exists', function() {
    const thisContent = Object.assign({}, content, {attributes: {permalink: 'about/me'}});
    const thisPathInfo = Object.assign({}, pathInfo);
    
    const htmlData = HTMLTransformer(thisContent, thisPathInfo);
    assert.equal(htmlData.permalink, 'about/me');
  });

  it('should flag frontpage if index.html', function() {
    const thisContent = Object.assign({}, content);
    const thisPathInfo = Object.assign({}, pathInfo, {fullPath: 'index.html', dir: '', name: 'index'});
    
    const htmlData = HTMLTransformer(thisContent, thisPathInfo);
    assert.equal(htmlData.front, true);
  });

});