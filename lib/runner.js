var pm2       = require('pm2');
var config    = require('../lib/config');
var apiConfig = config.load();

var runner = {

  find: function (callback) {
    pm2.connect(function(err) {
        pm2.list(function(err, processes) {
          if (err) {
            pm2.disconnect(function() {
              callback(err);
            });
            return;
          }
          var found;
          processes.forEach(function(api) {
             if (api.pm2_env.name === apiConfig.name) {
               found = {
                name: api.pm2_env.name,
                pid: api.pm2_env.pm_id,
                dir: api.pm2_env.pm_cwd,
                status: api.pm2_env.status,
                uptime: api.pm2_env.pm_uptime,
                log: {
                  out:  api.pm2_env.pm_out_log_path,
                  err:  api.pm2_env.pm_err_log_path,
                  pid:  api.pm2_env.pm_pid_path
                }
              }
            }
          });

          pm2.disconnect(function() {
            callback(null, found);
          });
        });
    })
  },

  start: function (callback) {

    runner.find(function(err, api) {
      if (err) {
        callback(err);
        return;
      }

      if (api) {
        callback(new Error("Already started"));
        return;
      }

      pm2.connect(function(err) {
        pm2.start(config.apiTiberFile(), { name: apiConfig.name }, function(err, proc) {
          if (err) {
            pm2.disconnect(function() {
              callback(err);
            });
            return;
          }
          pm2.disconnect(function() {
            callback();
          });
        });
      })

    });
  },

  remove: function (callback) {
    runner.find(function(err, api){
      if (err) {
        callback(err);
        return;
      }

      if (!api) {
        callback(new Error("API was not started"))
        return;
      }

      pm2.connect(function(err) {
        pm2.delete(api.pid, function(err, proc) {
          if (err) {
            pm2.disconnect(function() {
              callback(err);
            });
            return;
          }
          pm2.disconnect(function() {
            callback();
          });
        });
      })

    });
  }
}


module.exports = runner;
