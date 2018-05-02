const Writer = require('./Writer');
const Config = require('./Config');
const { getPaths, sortPaths } = require('./Helpers');

function Static(input, output) { // Not sure about arguments yet.
  this.config = ''; // @TODO Function that merges default config with config file in project.
  this.isDebug = false;
  this.isDryRun = false;

  this.projectRoot = input || '.'; // Maybe convert or have an extra property with full path.
  this.output = output || '_site';
}

Static.prototype.setDryRun = function() {
  this.isDryRun = true;
}

Static.prototype.setDebug = function() {
  this.isDebug = true;
}

Static.prototype.init = async function() {
  // Call stuff, and build it.
  this.config = await Config(this.projectRoot);

  this.paths = await getPaths(this.projectRoot, this.config);

  this.writer = new Writer(this.paths, this.config, this.output);

  return true;
}

Static.prototype.getHelp = function() {
  let out = [];
  out.push("usage: static2");
  out.push("       static2 --watch");
  out.push("       static2 --input=. --output=./_site");
  out.push("");
  out.push("Arguments: ");
  out.push("  --version");
  out.push("  --serve");
  out.push("       Run web server on --port (default 8080) and --watch too");
  out.push("  --watch");
  out.push("       Wait for files to change and automatically rewrite");
  out.push("  --input=.");
  out.push("       Input template files (default: `.`)");
  out.push("  --output=_site");
  out.push("       Write HTML output to this folder (default: `_site`)");
  out.push("  --formats=liquid,md");
  out.push("       Whitelist only certain template types (default: `*`)");
  out.push("  --quiet");
  out.push("       Don’t print all written files (default: `false`)");
  out.push("  --pathprefix='/'");
  out.push("       Change all url template filters to use this subdirectory.");
  out.push("  --config=filename.js");
  out.push("      Override the static2 config file path (default: `.static2.js`)");
  out.push("  --dryrun");
  out.push("       Don’t write any files.");
  out.push("  --help");

  return out.join("\n");
};

Static.prototype.write = function() {
  // Now we are ready to do the real stuff!
  // Go through all files, check for yaml-frontmatter, gather information and return it in a structured way.
  this.writer.write();
}


module.exports = Static;