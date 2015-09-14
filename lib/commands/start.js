var coreutils = require('coreutils');
var logger    = coreutils.logger;
var runner    = require('../runner');
var config    = require('../config');

var command = {
  description: "starts your api",
  args: "",
  exec: function() {

    if (!config.isTiberApi()) {
      logger.error("This is not a tiber api. Run init first");
      return;
    }

    logger.info("Starting...");

    runner.start(function(err) {
      if (err) {
        logger.fail(err);
        return;
      }

      logger.ok("Started");
    });
  }
}

module.exports = command;
