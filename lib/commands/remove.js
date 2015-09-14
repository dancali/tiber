var coreutils = require('coreutils');
var logger    = coreutils.logger;
var runner    = require('../runner');
var config    = require('../config');

var command = {
  description: "removes your api",
  args: "",
  exec: function () {

    if (!config.isTiberApi()) {
      logger.error("This is not a tiber api. Run init first");
      return;
    }

    logger.info("Removing...");
    runner.remove(function(err) {
      if (err) {
        logger.fail(err);
        return;
      }

      logger.ok("Removed");
    });
  }
}

module.exports = command;
