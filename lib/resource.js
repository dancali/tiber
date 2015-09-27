
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

      for(field in controller.schema) {
        if (controller.schema[field].required) {
          if (req.body instanceof Array) {
            for (var i = 0; i < req.body.length; i++) {
              req.checkBody([i, field], '[' + field + '] is required in element ' + i).notEmpty();
            }
          } else {
            req.checkBody(field, '[' + field + '] is required').notEmpty();
          }
        }
      }

      var errors = req.validationErrors();
      if (errors && errors.length > 0) {
        res.json({errors: errors});
        return;
      }


      if (req.body instanceof Array) {
        for (var i = 0; i < req.body.length; i++) {
          storage.save(controller, req.body[i]);
        }
      } else {
        storage.save(controller, req.body);
      }

      controller.post(req, res);
    });

    return router;
  }
}

module.exports = resource;
