#!/usr/bin/env node

const ora = require('ora');
const argv = require("minimist")(process.argv.slice(2));

const App = require('./src/index.js');

const app = new App();

app.init().then(function() {
  
  if (argv.help) {
    console.log(app.getHelp());
  }
  else {
    app.write();
  }
});
