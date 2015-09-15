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
    var subject = "New signup [" + request.name + " @ " + request.start + "]";
    var body    = {
      text: "Name: " + request.name + " (" + request.email + ")\n\n" + request.start + " - " + request.end,
      html: "Name: <b>" + request.name + " (" + request.email + ")</b><br><br>" + "<p>" + request.start + " - " + request.end + "</p>"
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
