module.exports = {
  name: 'events',

  schema: {
    name: { type: "TEXT", required: true },
    org: { type: "TEXT", required: true },
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
    response.json(all);
  },

  post: function(request, response) {
    var subject = "";
    var body    = {text: "", html: ""};
    var utils   = require('../util/core');

    if (request.body instanceof Array) {
      subject = request.body.length + " new signups";
      request.body.forEach(function(element){
        body.text += "---\n\nName: " + element.name + " (" + element.email + ")\n\n" + utils.niceInterval(element.start, element.end);
        body.html += "<br><hr><br>Name: <b>" + element.name + " (" + element.email + ")</b><br><br>" + "<p>" +  utils.niceInterval(element.start, element.end) + "</p>";
      });
    } else {
      subject   = "New signup [" + request.body.name + "]";
      body.text = "Name: " + request.body.name + " (" + request.body.email + ")\n\n" +  utils.niceInterval(request.body.start, request.body.end);
      body.html = "Name: <b>" + request.body.name + " (" + request.body.email + ")</b><br><br>" + "<p>" +  utils.niceInterval(request.body.start, request.body.end) + "</p>";
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
