var coreutils = require('coreutils');
var logger    = coreutils.logger;
var runner    = require('../runner');
var config    = require('../config');

var command = {
  description: "checks the status of your api",
  args: "",
  exec: function() {

    if (!config.isTiberApi()) {
      logger.error("This is not a tiber api. Run init first");
      return;
    }

    runner.find(function(err, api) {
      if (err) {
        logger.fail(err);
        return;
      }

      if (!api) {
        logger.info("Not found");
        return;
      }
      
      console.log(api);
    });
  }
}

module.exports = command;
