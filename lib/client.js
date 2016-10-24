module.exports = function(options) {

  var HttpsClient = require('./https_client');
  var HttpClient = require('./http_client');

  var client = (options.protocol == 'https:')
    ? new HttpsClient(this, options)
    : new HttpClient(this, options);

  var parent = this;

  this.callbacks = {
    error: function(e) { console.log(e); },
  };

  /**
   * Do http request and handle response
   */
  this.request = function(method, params, callback) {
    params.requestType = method;
    client.request(params, function(res) {
      var data = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {

        try {
          data = JSON.parse(data);
        } catch (e) {
          parent.callbacks['error'](e);
          return;
        }

        callback(data);

      });
    });
  };

  /**
   * Register event listener
   */
  this.request('eventRegister', { add: true }, function(err, data) {
    parent.waitEvent();
  });


  /**
   * Register event callbacks
   */
  this.on = function(event, callback) {

    if (event == 'error') {
      this.callbacks.error = callback;
      return;
    }

    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  };

  /**
   * Handle events
   */
  this.waitEvent = function() {

    this.request('eventWait', {timeout: options.eventTimeout}, function(resp) {

      for (var i in resp.events) {
        var name = resp.events[i].name;
        var data = resp.events[i].ids;
        if (typeof parent.callbacks[name] === 'function') {
          parent.callbacks[name](data);
        }
        if (parent.callbacks[name] instanceof Array) {
          for (var j in parent.callbacks[name]) {
            parent.callbacks[name][j](data);
          }
        }
      }

      setTimeout(function() {
        parent.waitEvent();
      }, options.eventTimeout);

    });
  };

  return this;
};
