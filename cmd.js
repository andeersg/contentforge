#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));

const Static2 = require('./src/Static.js');

const static2 = new Static2('.', '_site');

static2.init().then(function() {
  if (argv.help) {
    console.log(static2.getHelp());
  }
  else {
    static2.write();
  }
});