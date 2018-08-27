const path = require('path');
const { EventEmitter } = require('events');
const Templates = require('./Templates');
const ContentLoader = require('./ContentLoader');
const Writer = require('./Writer');
const Config = require('./Config');


class App extends EventEmitter {
  constructor() {
    super();

    this.isDebug = false;
    this.isDryRun = false;

    this.projectRoot = '.';
    
    this.output = '_site';

    this.setDryRun = this.setDryRun.bind(this);
    this.setDebug = this.setDebug.bind(this);
    this.init = this.init.bind(this);
    this.getHelp = this.getHelp.bind(this);
    this.write = this.write.bind(this);
  
    console.log('Initiating App');
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

    this.templates = new Templates();
    this.contentLoader = new ContentLoader(this.config);
    this.writer = new Writer(this.config, this.templates);
    //this.render = new Render(this.config);
    //this.writer = new Writer(this.projectRoot, this.output, this.config, this.isDryRun);

    return true;
  }

  getHelp() {
    let out = [];
    out.push("usage: [name]");
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
    try {
      const templates = this.templates.initiateTemplates();
      // console.log(templates);

      const content = this.contentLoader.scan();
      //Object.keys(content.content).map((i) => console.log(content[i].permalink));

      this.writer.addContent(content);
      this.writer.write();
    }
    catch(error) {
      console.log(error);
    };

    // this.analyzer.analyze().then((res) => {
    //   this.emit('step_complete', 'Finished analyzing source folder');
    //   this.emit('step', 'Parse content');
    //   return res;
    // })
    // .then(this.render.build)
    // .then((res) => {
    //   this.emit('step_complete', 'Finished rendering content');
    //   this.emit('step', 'Writing content to output folder');
    //   return res;
    // })
    // .then(this.writer.write)
    // .then(() => {
    //   this.emit('step_complete', 'Finished writing to output folder');
    // })
    // .catch((e) => {
    //   console.log('Error:');
    //   console.log(e);
    //   this.emit('fail', 'Command crashed');
    //   // Kill process if anything crashes.
    //   process.exit(0);
    // });
  }

}

module.exports = App;
