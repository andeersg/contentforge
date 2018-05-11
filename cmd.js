#!/usr/bin/env node
const ora = require('ora');

const argv = require("minimist")(process.argv.slice(2));

const Mifflin = require('./src/Mifflin.js');

const mifflin = new Mifflin('.', '_site');

const spinner = ora('Initiating');

mifflin.init().then(function() {
  
  if (argv.help) {
    console.log(mifflin.getHelp());
  }
  else {
    spinner.start();
    mifflin.write();
  }
});

mifflin.on('step', (msg) => {
  spinner.start(msg);
});
mifflin.on('step_complete', (msg) => {
  spinner.succeed(msg);
});
mifflin.on('fail', (msg) => {
  spinner.fail(msg);
});