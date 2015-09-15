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
      // Create the table if necessary
      var fields = storage.fields(controller);
      db.run("CREATE TABLE IF NOT EXISTS " + controller.name + " (id INTEGER PRIMARY KEY,timestamp TEXT," + fields.fields + ")");

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

  fields: function(controller, request) {
    // Compound the fields
    var result = {
      fields     : [],
      fieldNames : [],
      values     : []
    }

    for(field in controller.schema) {
      var type  = controller.schema[field].type;
      var value;

      if (request) {
        value = request.body[field];
      }

      if (type === 'EMAIL' || type === 'DATE' || type === 'PHONE') {
        type = 'TEXT';
      }

      if (type === 'TEXT') {
        value = "'" + value + "'";
      }

      result.fieldNames.push(field);
      result.fields.push(field + " " + type);
      result.values.push(value);
    }

    result.fields     = result.fields.join(",");
    result.fieldNames = result.fieldNames.join(",");
    result.values     = result.values.join(",");

    return result;
  },

  save: function(controller, request) {

    // Create the db file if necessary
    var db = storage.db();

    db.serialize(function() {
      // Create the table if necessary
      var fields = storage.fields(controller, request);
      db.run("CREATE TABLE IF NOT EXISTS " + controller.name + " (id INTEGER PRIMARY KEY,timestamp TEXT," + fields.fields + ")");

      // Insert a row
      var now = new Date().toISOString().slice(0,19).replace(/T/g," ");
      var stmt = db.prepare("INSERT INTO " + controller.name + " (timestamp," + fields.fieldNames + ") VALUES ('" + now + "'," + fields.values + ")");
      stmt.run();
      stmt.finalize();
    });

    // Clean up
    db.close();
  }
}

module.exports = storage;
