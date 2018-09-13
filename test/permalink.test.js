const assert = require('assert');
const ContentLoader = require('../src/ContentLoader');

const testClass = new ContentLoader({});

describe('Permalinks', function() {
  it('should return the defined permalink if available', function() {
    const example = {
      variables: {
        permalink: '/about',
      }
    };
    assert.equal(testClass.renderPermalink(example), '/about/');
  });

});