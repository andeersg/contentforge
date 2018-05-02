const path = require('path');
const defaultConfig = require('./DefaultConfig.json');
const { jsonReadFile } = require('./Helpers');

async function Config(projectRoot) {
  // Require a file with default config.
  const configPath = path.resolve(process.cwd(), './config.json');
  try {
    const projectConfig = await jsonReadFile(configPath);
    return Object.assign({}, defaultConfig, projectConfig);
  }
  catch(e) {
    return false;
  }
}

module.exports = Config;