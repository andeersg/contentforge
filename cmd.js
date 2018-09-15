#!/usr/bin/env node

const meow = require('meow');
const chalk = require('chalk');
const log = console.log;

const App = require('./src/index.js');

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
const environment = process.env.ENV || 'development';
const start = new Date().getTime();

log(`${chalk.green('Raccn')} version ${chalk.yellow(cli.pkg.version)}\n`);

function cleanup() {
  const elapsed = (new Date().getTime() - start) / 1000;

  log(`\nFinished in ${chalk.green(elapsed)} seconds`);
}


switch (command) {
  case 'build':
    app.init({...cli.flags, environment}).then(function() {
      app.write();
      cleanup();
    });
    break;

  case 'watch':
    log(chalk.red('Method "watch" is not yet implemented'));
    cleanup();
    break;

  case 'serve':
    log(chalk.red('Method "serve" is not yet implemented'));
    cleanup();
    break;

  case 'help':
  default:
    cli.showHelp();
}

