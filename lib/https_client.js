module.exports = function(event, options) {

  const https = require('https');
  const querystring = require('querystring');

  this.request = function(params, callback) {

    const postData = querystring.stringify(params);
    const req = https.request(options, callback);

    req.write(postData);
    req.on('error', function(err) {
      event.emit('error', err);
    });
    req.end();

    event.on('exit', function(force) {
      if (force) {
        req.abort();
      }
    });
  };

  return this;
};
