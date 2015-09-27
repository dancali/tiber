module.exports = {
  name: 'events',

  schema: {
    name: { type: "TEXT", required: true },
    org: { type: "TEXT", required: true },
    email: { type: "EMAIL", required: true },
    phone: { type: "PHONE", required: true },
    start: { type: "DATE", required: true },
    weight: { type: "NUMBER", required: true},
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
        body.text += "---\n\nName: " + element.name + "\n\nPeople: " + element.weight + "\n\nEmail: " + element.email + "\n\nInterval: " + utils.niceInterval(element.start, element.end);
        body.html += "<br><hr><br>Name: " + element.name + "<br>People: " + element.weight + "<br>Email: " + element.email + "<br>" + "Interval: " +  utils.niceInterval(element.start, element.end);
      });
    } else {
      subject   = "New signup [" + request.body.name + "]";
      body.text = "Name: " + request.body.name + "\n\nPeople: " + request.body.weight + "\n\nEmail: " + request.body.email + "\n\nInterval: " +  utils.niceInterval(request.body.start, request.body.end);
      body.html = "Name: " + request.body.name + "<br>People: " + request.body.weight + "<br>Email: " + request.body.email + "<br>" + "Interval: " +  utils.niceInterval(request.body.start, request.body.end);
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
