#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));

const ContentForge = require('./src/Content-Forge.js');

const contentForge = new ContentForge('.', '_site');

contentForge.init().then(function() {
  if (argv.help) {
    console.log(contentForge.getHelp());
  }
  else {
    contentForge.write();
  }
});