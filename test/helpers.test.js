const assert = require('assert');
const Helpers = require('../src/Helpers');
const mock = require('mock-fs');
const moment = require('moment');

describe('Helpers', function() {

  describe('jsonReadFile', function() {
    before(function() {
      mock({
        'data/info.json': '{"content": "This JSON is valid"}',
        'data/broken.json': '{content: "This JSON is invalid"}',
      });
    });

    it('should reject if JSON is not parseable', function() {
      Helpers.jsonReadFile('data/broken.json')
      .catch(function(e) {
        assert.equal(e, 'Unable to read json file: data/broken.json');
      });
    });

    it('should reject if file is not found', function() {
      Helpers.jsonReadFile('data/404.json')
      .catch(function(e) {
        assert.equal(e, 'File does not exist: data/404.json');
      });
    });

    it('should return parsed JSON', function() {
      Helpers.jsonReadFile('data/info.json')
      .then(function(file) {
        assert.equal(file.content, 'This JSON is valid');
      });
    });

    after(function() {
      mock.restore();
    });
  });

  describe('post sorting', function() {
    const posts = [
      {
        id: 1,
        published: moment('2018-05-22', 'YYYY-MM-DD'),
      },
      {
        id: 2,
        published: moment('2018-05-11', 'YYYY-MM-DD'),
      },
      {
        id: 3,
        published: moment('2018-05-18', 'YYYY-MM-DD'),
      },
      {
        id: 4,
        published: moment('2018-05-18', 'YYYY-MM-DD'),
      },
    ];
    let testPost;

    beforeEach(function() {
      testPost = [...posts];
    });

    it('should sort posts in order with newest first', function() {
      const sortedPosts = testPost.sort(Helpers.sortPostsNewest);
      assert.deepEqual(sortedPosts.map((i => i.id)), [1, 3, 4, 2]);
    });
    
    it('should sort posts in order with oldest first', function() {
      const sortedPosts = testPost.sort(Helpers.sortPostsOldest);
      assert.deepEqual(sortedPosts.map((i => i.id)), [2, 3, 4, 1]);
    });

  });

});