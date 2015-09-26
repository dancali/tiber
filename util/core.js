var moment = require('moment');

var utils = {
  niceInterval: function(start, end) {
    var s = moment(start, 'YYYY-MM-DD HH:mm');
    var e = moment(end, 'YYYY-MM-DD HH:mm');
    if (s.diff(e, "day") == 0) {
      return s.format("ddd, MMM DD") + " @ " + s.format("HH:mm") + " - " + e.format("HH:mm");
    } else {
      return s.format("ddd, MMM DD @ HH:mm") + " - " + e.format("ddd, MMM DD @ HH:mm");
    }
  },

  niceDate: function(date) {
    return moment(date, 'YYYY-MM-DD HH:mm').format("ddd, MMM DD, HH:mm");
  }
}

module.exports = utils;
