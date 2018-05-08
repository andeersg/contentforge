#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));

const Mifflin = require('./src/Mifflin.js');

const mifflin = new Mifflin('.', '_site');

mifflin.init().then(function() {
  if (argv.help) {
    console.log(mifflin.getHelp());
  }
  else {
    mifflin.write();
  }
});