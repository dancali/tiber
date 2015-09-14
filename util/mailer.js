var config    = require('../lib/config');
var apiConfig = config.load();

// Used for sending emails
var mandrill = require ('mandrill-api/mandrill');

// Configure the mailer
var mail = new mandrill.Mandrill(apiConfig.mandrill.key);

// Sends a message
exports.send = function (subject, htmlBody, textBody, onSuccess, onError) {

   var emails = [];

   apiConfig.mandrill.to.forEach(function(email) {
     emails.push({type: 'to', email: email});
   });

   var message = {
            "html": htmlBody,
            "text": textBody,
            "subject": subject,
            "from_email": apiConfig.mandrill.from.email,
            "from_name": apiConfig.mandrill.from.name,
            "to": emails,
            "headers": {
                "Reply-To": apiConfig.mandrill.from.email
            }
    };
    var async = false;
    var ip_pool = "Main Pool";
    var send_at = "2010-10-10 10:10:10";
    mail.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at},
       function(result) {
            if (onSuccess) {
               onSuccess(result);
            }
        },
        function(e) {
            if (onError) {
              onError(e);
            }
        }
    );
};
