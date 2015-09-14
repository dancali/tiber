var coreutils = require('coreutils');
var logger    = coreutils.logger;
var runner    = require('../runner');
var config    = require('../config');
var awsome    = require('awsome');

var command = {
  description: "deploys your api",
  args: "",
  exec: function() {

    if (!config.isTiberApi()) {
      logger.error("This is not a tiber api. Run init first");
      return;
    }

    logger.info("Deploying...");
    
    awsome.app.deploy(config.apiDir(), 'appserver1', 'domain', function(err) {
      if (err) {
        logger.error(err);
        return;
      }

      logger.ok("Deployed successfully");
    });
  }
}

module.exports = command;
