const path = require('path');
const Writer = require('./Writer');
const Config = require('./Config');
const Analyzer = require('./Analyzer');
const Render = require('./Render');

function ContentForge(input, output) { // Not sure about arguments yet.
  this.config = ''; // @TODO Function that merges default config with config file in project.
  this.isDebug = false;
  this.isDryRun = false;

  this.projectRoot = input || '.'; // Maybe convert or have an extra property with full path.
  // path.resolve(process.cwd()
  
  this.output = output || '_site';
}

ContentForge.prototype.setDryRun = function() {
  this.isDryRun = true;
}

ContentForge.prototype.setDebug = function() {
  this.isDebug = true;
}

ContentForge.prototype.init = async function() {
  // Call stuff, and build it.
  this.config = await Config(this.projectRoot);

  this.analyzer = new Analyzer(this.projectRoot, this.config);
  this.render = new Render(this.config);
  this.writer = new Writer(this.projectRoot, this.output, this.config, this.isDryRun);

  return true;
}

ContentForge.prototype.getHelp = function() {
  let out = [];
  out.push("usage: contentforge");
  out.push("");
  out.push("Arguments: ");
  out.push("  --version");
  out.push("  --serve");
  out.push("       Run web server on --port (default 8080) and --watch too");
  out.push("  --quiet");
  out.push("       Don’t print all written files (default: `false`)");
  out.push("  --dryrun");
  out.push("       Don’t write any files.");
  out.push("  --help");

  return out.join("\n");
};

ContentForge.prototype.write = function() {
  // @TODO Add an eventemitter for updates.
  this.analyzer.analyze().then((res) => {
    console.log('Step 1 completed!');
    return res;
  })
  .then(this.render.build)
  .then((res) => {
    console.log('Step 2 completed!');
    return res;
  })
  .then(this.writer.write)
  .then(() => {
    console.log('Finished!');
  })
  .catch((e) => {
    console.log('Error:');
    console.log(e);
  });
}


module.exports = ContentForge;
