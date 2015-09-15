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
    response.json({success: true});
  },

  request: function(request, response) {
    // console.log('[%d] %s %s', Date.now(), request.method, request.originalUrl);
  }
}
