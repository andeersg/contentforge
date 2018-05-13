const moment = require('moment');
const { sortPostsNewest } = require('./Helpers');

function registerHelpers(hb) {

  /**
   * Print object as JSON.
   */
  hb.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
  });

  /**
   * Formats a moment object.
   */
  hb.registerHelper('date', function(context) {
    return context.format('MMMM DD, Y');
  });

  /**
   * Display a collection sorted by latest first. Optional argument specifing
   * number of posts.
   */
  hb.registerHelper('latest', function(context, options) {
    const limit = parseInt(options.hash.limit) || 5;
    let ret = "";
    let  i = 0;
    let  j = (limit < context.length) ? limit : context.length;

    context.sort(sortPostsNewest);

    for(i, j; i < j; i++) {
      ret += options.fn(context[i]);
    }

    return ret;
  });

  /**
   * Prints the build date in the given format.
   */
  hb.registerHelper('date_now', function(context) {
    return moment().format(context);
  });

  /**
   * Groups content by year.
   */
  hb.registerHelper('group_by_year', function(context, options) {
    const yearPosts = {};
    let ret = "";

    context.forEach((post) => {
      if (typeof yearPosts[post.published.format('Y')] == 'undefined') {
        yearPosts[post.published.format('Y')] = [];
      }

      yearPosts[post.published.format('Y')].push(post);
    });

    for(let i in yearPosts) {
      ret += options.fn({
        year: i,
        posts: yearPosts[i],
      });
    }

    return ret;
  });

}

module.exports = registerHelpers;