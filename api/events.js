module.exports = {
  name: 'events',

  schema: {
    name: { type: "TEXT", required: true },
    email: { type: "EMAIL", required: true },
    phone: { type: "PHONE", required: true },
    start: { type: "DATE", required: true },
    end: { type: "DATE", required: true }
  },

  get: function(request, response, list) {
    var all = [];
    list.forEach(function(item){
      all.push({start: item.start, end: item.end});
    });
    response.json({success: true, data: all});
  },

  post: function(request, response) {
    var subject = "New signup [" + request.body.name + " @ " + request.body.start + "]";
    var body    = {
      text: "Name: " + request.body.name + " (" + request.body.email + ")\n\n" + request.body.start + " - " + request.body.end,
      html: "Name: <b>" + request.body.name + " (" + request.body.email + ")</b><br><br>" + "<p>" + request.body.start + " - " + request.body.body.end + "</p>"
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
