const path = require('path');
const { EventEmitter } = require('events');
const Templates = require('./Templates');
const ContentLoader = require('./ContentLoader');
const Writer = require('./Writer');
const Config = require('./Config');


class App extends EventEmitter {
  constructor() {
    super();

    this.projectRoot = '.';
    
    this.output = '_site';

    this.init = this.init.bind(this);
    this.write = this.write.bind(this);
  }

  async init(options) {
    // Call stuff, and build it.
    this.config = await Config(this.projectRoot);
    this.config.environment = options.environment;

    this.isDebug = options.debug;
    this.isDryRun = options.dryRun;
    this.silent = options.silent;

    this.templates = new Templates();
    this.contentLoader = new ContentLoader(this.config);
    this.writer = new Writer(this.config, this.templates);

    return true;
  }

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
  }

}

module.exports = App;
