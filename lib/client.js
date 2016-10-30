module.exports = function(options) {

  const EventEmitter = require('events');
  const HttpsClient = require('./https_client');
  const HttpClient = require('./http_client');

  this.event = new EventEmitter();

  const client = (options.protocol == 'https:')
    ? new HttpsClient(this.event, options)
    : new HttpClient(this.event, options);

  const parent = this;

  /**
   * Do http request and handle response
   */
  this.request = function(method, params, callback) {
    params.requestType = method;
    client.request(params, function(res) {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {

        try {
          data = JSON.parse(data);
        } catch (e) {
          parent.event.emit('error', e);
          return;
        }

        callback(data);

      });
    });
  };

  /**
   * Register event listener
   */
  this.request('eventRegister', {}, function(data) {
    parent.waitEvent();
  });

  /**
   * Handle events
   */
  this.waitEvent = function() {
    const onEventWait = function(resp) {
      for (var i in resp.events) {
        const name = resp.events[i].name;
        const data = resp.events[i].ids;
        parent.event.emit(name, data);
      }
      setTimeout(
        function() {
          parent.waitEvent();
        },
        options.eventTimeout
      );
    };
    this.request(
      'eventWait',
      { timeout: options.eventTimeout },
      onEventWait
    );
  };

  return this;
};
