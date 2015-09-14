module.exports = {
  name: 'messages',

  schema: {
    name: { type: "TEXT", required: true },
    email: { type: "EMAIL", required: true },
    message: { type: "TEXT", required: true },
    context: { type: "TEXT", required: true }
  },

  get: function(request, response, list) {
    response.json({success: true, data: list});
  },

  post: function(request, response) {
    var subject = "New @" + request.body.context + " message";
    var body    = {
      text: "From: " + request.body.email + " (" + request.body.name + ")\n\n" + request.body.message,
      html: "From: <b>" + request.body.email + " (" + request.body.name + ")</b><br><br>" + "<p>" + request.body.message + "</p>"
    }

    var mailer = require ('../util/mandrill');

    mailer.send(subject, body.html, body.text, function(result) {
      response.json({success: true, data: result});
    }, function(error) {
      response.json({error: error});
    });
  },

  request: function(request, response) {
    // console.log('[%d] %s %s', Date.now(), request.method, request.originalUrl);
  }
}
