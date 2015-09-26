var express   = require ('express');
var parser    = require ('body-parser');
var validator = require ('validator');
var expVal    = require ('express-validator');
var path      = require('path');
var cors      = require('cors');
var coreutils = require('coreutils');
var fs        = require('fs-extra');
var logger    = coreutils.logger;
var config    = require('../lib/config');
var apiConfig = config.load();

var api = {

  start: function() {
    // Create the main app
    var app = express();

    // Enable CORS
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    // Parse forms
    app.use (parser.urlencoded({extended: true}));

    // Parse application/json
    app.use (parser.json());

    // Validate input
    app.use(expVal());

    // Enable the API
    var resourceFiles = fs.readdirSync(path.join(__dirname, '../api'));
    resourceFiles.forEach(function(resourceName) {
      resourceName = path.basename(resourceName, ".js")
      var controller = require('../api/' + resourceName);
      var resource   = require('../lib/resource');
      app.use ('/' + resourceName, resource.router(controller));
    });

    // Start the server
    app.listen(apiConfig.port);

    logger.info("Tiber api started on port " + apiConfig.port);

    return app;
  }
}

module.exports = api;
