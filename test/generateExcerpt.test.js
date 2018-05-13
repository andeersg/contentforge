const assert = require('assert');
const generateExcerpt = require('../src/generateExcerpt');

describe('generateExcerpt', function() {
  it('should return input if input is shorter than argument 2 and regular text', function() {
    assert.equal(generateExcerpt('This is the first test', 25), 'This is the first test');
  });

  it('should cut text at input length if no punctuation is found', function() {
    assert.equal(generateExcerpt('This is the first test', 10), 'This is th');
  });

  it('should return a complete sentence if punctuation is used.', function() {
    assert.equal(generateExcerpt('Example sentences are not so good. Real ones are better.', 40), 'Example sentences are not so good.');
  });

  it('should return a stripped string', function() {
    assert.equal(generateExcerpt('<p>This is a sample intro</p>', 40), 'This is a sample intro');
  });
  
  it('should return a stripped string with punctuation.', function() {
    assert.equal(generateExcerpt('<p>This is a sample intro.</p> <p>With more sentences.</p> <p>That is nice.</p>', 45), 'This is a sample intro. With more sentences.');
  });
});