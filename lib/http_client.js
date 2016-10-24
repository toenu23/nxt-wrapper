module.exports = function(client, options) {

  var http = require('http');
  var querystring = require('querystring');

  this.request = function(params, callback) {

    var postData = querystring.stringify(params);
    var req = http.request(options, callback);

    req.write(postData);
    req.on('error', client.callbacks['error']);
    req.end();
  };

  return this;
};
