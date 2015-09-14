// Utilities
var util = require ('util');

// Used for email communication
var mailer = require ('../util/mailer');

// Create the plain router
var router = require ('express').Router();

// Router analytics
router.use (function(req, res, next) {
  // console.log('[%d] %s %s %s %s %s', Date.now(), req.method, req.url, req.path, req.originalUrl, req.body);
  next();
});

// User creation
router.route("/").post (function (req, res) {

  // Check the request payload
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('context', 'Context is required').notEmpty();
  req.checkBody('message', 'Message is required').notEmpty();

  // Make sure the payload is valid
  var errors = req.validationErrors();
  if (errors) {
    res.json({error: "Invalid request", data:errors});
    return;
  }

  // Construct the message as an email
  var email   = req.body.email;
  var context = req.body.context;
  var subject = "New @" + context + " message";
  var message = req.body.message;
  var name    = req.body.name;
  var body    = {
    text: "From: " + email + " (" + name + ")\n\n" + message,
    html: "From: <b>" + email + " (" + name + ")</b><br><br>" + "<p>" + message + "</p>"
  }

  // Email the message
  mailer.send(subject, body.html, body.text, function(result) {
    res.json({success: true, data: result});
  }, function(error) {
    res.json({error: $error});
  });
});

// Export the router
module.exports = router;
