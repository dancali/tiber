var controller = {

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

  print: function (response, list) {
    var admin = {};
    var moment = require('moment');
    list.forEach(function(item) {
      var check = moment().diff(moment(item.start, 'YYYY-MM-DD'), 'days');
      if (check <= 0 && check >= -1) {
        var s = moment(item.start).format("YYYY-MM-DD");
        if (!admin[s]) {
          admin[s] = [];
        }
        admin[s].push(item);
        admin[s].sort(function(a,b) {
          var diff = moment(a.start, 'YYYY-MM-DD HH:mm').diff(moment(b.start, 'YYYY-MM-DD HH:mm'));
          return diff;
        });
      }
    });

    var subject   = "Report";
    var html  = "";
    var keys = Object.keys(admin);
    keys.sort();
    keys.forEach(function(day) {
      html += "<br><div id=\"" + moment(day, "YYYY-MM-DD HH:mm").format("MMDD") + "\">" + moment(day, "YYYY-MM-DD").format("ddd, MMM Do");
      html += "</div><br><table style=\"padding: 10px; border: 1px solid #cccccc;\"><tr style=\"\"><th>hour</th><th>people</th><th>name</th><th>email</th><th>phone</th><th>org</th></tr>";
      admin[day].forEach(function(hour) {
        html += "<tr>";
        html += "<td style=\"text-align: center; padding: 10px;\">" + moment(hour.start, "YYYY-MM-DD HH:mm").format("HH:mm") + "</td>";
        html += "<td style=\"text-align: center; padding: 10px; \">" + (hour.weight ? hour.weight : 1) + "</td>";
        html += "<td style=\"text-align: left; padding: 10px; \">" + hour.name + "</td>";
        html += "<td style=\"text-align: left; padding: 10px; \">" + hour.email + "</td>";
        html += "<td style=\"text-align: left; padding: 10px; \">" + hour.phone + "</td>";
        html += "<td style=\"text-align: center; padding: 10px; \">" + (hour.org ? hour.org : "") + "</td>";
        html += "</tr>";
      })
      html += "</table>";
    });

    var mailer = require ('../util/mandrill');
    mailer.send(subject, html, html, function(result) {
      // response.json({success: true, data: result});
    }, function(error) {
      // response.json({error: error});
    });
  },

  get: function(request, response, list) {
    var all = [];
    list.forEach(function(item) {
      all.push({start: item.start, end: item.end, weight: item.weight});
    });
    response.json(all);
  },

  post: function(request, response) {
    var subject = "";
    var body    = {text: "", html: ""};
    var utils   = require('../util/core');

    var storage = require ('../util/storage');

    storage.find(controller, function(err, list){
       if (!err) {
         controller.print(response, list);
       }
    });

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
};

module.exports = controller;
