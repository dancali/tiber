var express   = require ('express');
var parser    = require ('body-parser');
var validator = require ('express-validator');
var path      = require('path');
var cors      = require('cors');
var coreutils = require('coreutils');
var logger    = coreutils.logger;
var config    = require('../lib/config');
var apiConfig = config.load();

var api = {

  start: function() {
    // Create the main app
    var app = express();

    if (!apiConfig.local) {
      // Use cors in production
      var corsOptions = {
        origin: function(origin, callback) {
          var originIsWhitelisted = config.security.allowedDomains.indexOf(origin) !== -1;
          callback(null, originIsWhitelisted);
        }
      }
      app.use(cors(corsOptions));

      // Enable CORS
      app.use(function(req, res, next) {
          config.security.allowedDomains.forEach(function(domain){
            res.header('Access-Control-Allow-Origin', domain);
          });
          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          res.header('Access-Control-Allow-Headers', 'Content-Type');
          next();
      });
    }

    // Parse forms
    app.use (parser.urlencoded({extended: true}));

    // Parse application/json
    app.use (parser.json());

    // Validate input
    app.use(validator());

    // Enable the API
    app.use ('/messages', require ('../api/messages'));

    // Start the server
    app.listen(apiConfig.port);

    logger.info("Tiber api started on port " + apiConfig.port);
    return app;
  }
}

module.exports = api;
