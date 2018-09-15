const moment = require('moment');
const globby = require('globby');
const path = require('path');
const fs = require('fs');
const { sortPostsNewest } = require('./Helpers');

function loadPartials(hb) {
  const files = globby.sync('_includes/*');
  files.forEach((file) => {
    const pathInfo = path.parse(file);
    const content = fs.readFileSync(file, 'utf8');

    hb.registerPartial(pathInfo.name, content);
  });
}

function registerHelpersAndPartials(hb) {
  /**
   * Load all files in "_includes" as partials.
   */
  loadPartials(hb);

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

    const sortedYears = Object.keys(yearPosts).sort().reverse();
    
    sortedYears.forEach((year) => {
      ret += options.fn({
        year: year,
        posts: yearPosts[year],
      });
    });

    return ret;
  });


  /**
   * Hide parts from production.
   * 
   * For now it is not compiled at all. Could use env and compile in dev.
   */
  hb.registerHelper('beta', function(options) {
    return new hb.SafeString('');
  });

  hb.registerHelper('outdated', function(published, years, options) {
    const now = moment();
    const duration = moment.duration(now.diff(published));

    if (duration.get('year') > years) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  hb.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  hb.registerHelper('ifNot', function(v1, v2, options) {
    if(v1 !== v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
}

module.exports = registerHelpersAndPartials;