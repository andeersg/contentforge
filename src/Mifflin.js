const path = require('path');
const { EventEmitter } = require('events');
const Writer = require('./Writer');
const Config = require('./Config');
const Analyzer = require('./Analyzer');
const Render = require('./Render');

class Mifflin extends EventEmitter {
  constructor(input, output) {
    super();

    this.config = ''; // @TODO Function that merges default config with config file in project.
    this.isDebug = false;
    this.isDryRun = false;

    this.projectRoot = input || '.'; // Maybe convert or have an extra property with full path.
    // path.resolve(process.cwd()
    
    this.output = output || '_site';

    this.setDryRun = this.setDryRun.bind(this);
    this.setDebug = this.setDebug.bind(this);
    this.init = this.init.bind(this);
    this.getHelp = this.getHelp.bind(this);
    this.write = this.write.bind(this);
  }

  setDryRun() {
    this.isDryRun = true;
  }

  setDebug() {
    this.isDebug = true;
  }

  async init() {
    // Call stuff, and build it.
    this.config = await Config(this.projectRoot);

    this.analyzer = new Analyzer(this.projectRoot, this.config);
    this.render = new Render(this.config);
    this.writer = new Writer(this.projectRoot, this.output, this.config, this.isDryRun);

    return true;
  }

  getHelp() {
    let out = [];
    out.push("usage: mifflin");
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

  write() {
    // @TODO Add an eventemitter for updates.
    this.emit('step', 'Initiating write');

    this.analyzer.analyze().then((res) => {
      this.emit('step_complete', 'Finished analyzing source folder');
      this.emit('step', 'Parse content');
      return res;
    })
    .then(this.render.build)
    .then((res) => {
      this.emit('step_complete', 'Finished rendering content');
      this.emit('step', 'Writing content to output folder');
      return res;
    })
    .then(this.writer.write)
    .then(() => {
      this.emit('step_complete', 'Finished writing to output folder');
    })
    .catch((e) => {
      console.log('Error:');
      console.log(e);
    });
  }
}

module.exports = Mifflin;
