module.exports = function(event, options) {

  const http = require('http');
  const querystring = require('querystring');

  this.request = function(params, callback) {

    const postData = querystring.stringify(params);
    const req = http.request(options, callback);

    req.write(postData);
    req.on('error', function(err) {
      event.emit('error', err);
    });
    req.end();
  };

  return this;
};
