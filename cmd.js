#!/usr/bin/env node

const meow = require('meow');
const chalk = require('chalk');
const bs = require('browser-sync').create();
const watch = require('glob-watcher');
const log = console.log;

const App = require('./src/index.js');
const Config = require('./src/Config');

const app = new App();

const cli = meow(`
	Options
	  --silent, -s    Don't write anything to console
	  --debug, -d     Provide more debug information
	  --dry-run, -r   Don't write to output folder

	Commands
    build           Write content to output folder
    watch           Watch changes and recompile (not ready)
    serve           Launch web server and watch changes (not ready)
    init            Generate a new project
    help            Print this information
`, {
	booleanDefault: undefined,
	flags: {
		silent: {
			type: 'boolean',
			default: false,
			alias: 's'
		},
		debug: {
			type: 'boolean',
			default: false,
			alias: 'd'
    },
    dryRun: {
      type: 'boolean',
      default: false,
      alias: 'r'
    }
	}
});

const command = cli.input[0] || 'help';
const environment = process.env.NODE_ENV || 'development';
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const start = new Date().getTime();

log(`${chalk.green('Raccn')} version ${chalk.yellow(cli.pkg.version)}\n`);

function cleanup() {
  const elapsed = (new Date().getTime() - start) / 1000;

  log(`\nFinished in ${chalk.green(elapsed)} seconds`);
  process.exit();
}

const cliStuff = {
  cli: cli.flags,
  env: environment,
};


switch (command) {
  case 'build':
    Config(cliStuff).then((config) => {
      app.init(config).then(function() {
        app.write();
        cleanup();
      });
    });
    break;

  case 'watch':
    log(chalk.red('Method "watch" is not yet implemented'));
    Config(cliStuff).then((config) => {
      console.log(config);
      const ignorePaths = app.getIgnoreGlobs(config.ignore).map(i => `!${i}`);
      const paths = [
        '**/*',
        ...ignorePaths,
      ];
      
      const watcher = watch(paths);

      watcher.on('change', async path => {
        console.log('File changed:', path);
      });
    
      watcher.on('add', async path => {
        console.log('File added:', path);
      });
    }); 
    break;

  case 'serve':
    bs.init({
      server: "./_site"
    });
    Config(cliStuff).then((config) => {

      // @TODO We need ignore list for watch.
      // @TODO Call build when files change, or reload css if css change.
      const ignorePaths = app.getIgnoreGlobs(config.ignore).map(i => `!${i}`);
      const paths = [
        '**/*',
        ...ignorePaths,
      ];
      
      const watcher = watch(paths);

      watcher.on('change', async path => {
        app.init(config).then(function() {
          app.write();
        });
      });
    
      watcher.on('add', async path => {
        app.init(config).then(function() {
          app.write();
        });
      });
    });
    // @TODO Watch for changes.
    break;

  case 'help':
  default:
    cli.showHelp();
}

