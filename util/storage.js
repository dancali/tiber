var sqlite3   = require('sqlite3').verbose();
var config    = require('../lib/config');
var apiConfig = config.load();

var storage = {

  db: function () {
    return new sqlite3.Database(config.dbFile());
  },

  find: function(controller, callback) {
    // Create the db file if necessary
    var db = storage.db();

    db.serialize(function() {
      db.all("SELECT * FROM " + controller.name, function(err, rows) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, rows);
      });
    });

    // Clean up
    db.close();
  },

  save: function(controller, request) {

    // Create the db file if necessary
    var db = storage.db();

    db.serialize(function() {

      // Compound the fields
      var fields     = [];
      var fieldNames = [];
      var values     = [];

      for(field in controller.schema) {
        var type  = controller.schema[field].type;
        var value = request.body[field];

        if (type === 'EMAIL' || type === 'DATE' || type === 'PHONE') {
          type = 'TEXT';
        }

        if (type === 'TEXT') {
          value = "'" + value + "'";
        }

        fieldNames.push(field);
        fields.push(field + " " + type);
        values.push(value);
      }

      fields     = fields.join(",");
      fieldNames = fieldNames.join(",");
      values     = values.join(",");

      // Create the table if necessary
      var now = new Date().toISOString().slice(0,19).replace(/T/g," ");
      db.run("CREATE TABLE IF NOT EXISTS " + controller.name + " (id INTEGER PRIMARY KEY,timestamp TEXT," + fields + ")");

      // Insert a row
      var stmt = db.prepare("INSERT INTO " + controller.name + " (timestamp," + fieldNames + ") VALUES ('" + now + "'," + values + ")");
      stmt.run();
      stmt.finalize();
    });

    // Clean up
    db.close();
  }
}

module.exports = storage;
