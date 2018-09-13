const assert = require('assert');
const mock = require('mock-fs');
const moment = require('moment');
const PublishedDate = require('../src/PublishedDate');


describe('PublishedDate', function() {
  before(function() {
    mock({
      'pages/about.html': mock.file({
        content: 'Content is not important',
        birthtime: moment('2018-05-20', 'YYYY-MM-DD').toDate(),
      }),
    });
  });

  it('should prefer the attributes date if specified', function() {
      const date = PublishedDate({attributes: {published: '2018-05-21'}});
      assert.equal(date.format('YYYY-MM-DD'), '2018-05-21');
  });

  it('should extract date from filename if it matches the pattern', function() {
    const date = PublishedDate({attributes: {}}, {name: '2018-05-22-Mock-file-1'});
    assert.equal(date.format('YYYY-MM-DD'), '2018-05-22');
  });

  it('should get the created time of the file if no other method is specified', function() {
    const date = PublishedDate({attributes: {}}, {name: 'about', fullPath: 'pages/about.html'});
    assert.equal(date.format('YYYY-MM-DD'), '2018-05-20');
  });

  after(function() {
    mock.restore();
  });
});