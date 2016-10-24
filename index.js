module.exports = function(options) {

  var Client = require('./lib/client');

  if (options && options.host) {
    options.hostname = options.host;
    delete options.host;
  }

  if (!options || !options.hostname || !options.protocol) {
    return new Error('Missing arguments');
  }

  if (options.protocol == 'https' || options.protocl == 'http') {
    options.protocol = options.protocol + ':';
  }

  if (!options.port) {
    options.port = 7876;
  }

  if (!options.path) {
    options.path = '/nxt';
  }

  options.method = 'POST';

  options.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (!options.eventTimeout) {
    options.eventTime = 10;
  }

  return new Client(options);
};
