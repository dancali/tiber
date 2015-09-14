var path     = require('path');
var fs       = require('fs-extra');
var yaml     = require('js-yaml');

var config = {

  tiberDir: function () {
    return path.dirname(__dirname);
  },

  serverFile: function () {
    return path.join(config.tiberDir(), 'lib/server.js');
  },


  apiTiberFile: function () {
    return path.join(config.apiDir(), 'tiber.js');
  },

  apiDir: function () {
    return process.cwd();
  },

  apiConfigFile: function () {
    return path.join(config.apiDir(), 'tiber.yaml');
  },

  isTiberApi: function () {
    var configFile = config.apiConfigFile();
    return fs.existsSync(configFile);
  },

  load: function() {
    if (!config.isTiberApi()) {
      return;
    }

    return yaml.safeLoad(fs.readFileSync(config.apiConfigFile(), 'utf8'));
  },
};

module.exports = config;
