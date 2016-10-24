module.exports = function(client, options) {

  var https = require('https');
  var querystring = require('querystring');

  this.request = function(params, callback) {

    var postData = querystring.stringify(params);
    var req = https.request(options, callback);

    req.write(postData);
    req.on('error', client.callbacks['error']);
    req.end();
  };

  return this;
};
