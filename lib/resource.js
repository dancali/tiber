
var resource = {

  router: function(controller) {
    var router  = require ('express').Router();
    var storage = require ('../util/storage');

    router.use (function(req, res, next) {
      controller.request(req, res);
      next();
    });

    router.route("/").get(function (req, res) {
      storage.find(controller, function(err, list){
        if (err) {
          res.json({error: "Unable to fetch data", data: err});
          return;
        }
        
        // Process the request
        controller.get(req, res, list);
      });
    });

    router.route("/").post(function (req, res) {

      // Verify the fields
      for(field in controller.schema) {
        if (controller.schema[field].required) {
          req.checkBody(field, '[' + field + '] is required').notEmpty();
        }
        if (controller.schema[field].type === 'EMAIL') {
          req.checkBody(field, '[' + field + '] is not a valid email').isEmail();
        }
      }

      // Make sure the payload is valid
      var errors = req.validationErrors();
      if (errors) {
        res.json({error: "Invalid request", data:errors});
        return;
      }

      // Save the resource
      storage.save(controller, req);

      // Process the request
      controller.post(req, res);
    });

    return router;
  }
}

module.exports = resource;
