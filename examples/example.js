var Nxt = require('../index');

/**
 * Create a new instance of our client
 *
 * The following options are available:
 *
 * protocol: http or https (required)
 * host: IP or hostname (required)
 * port: Defaults to 7876
 * eventLoop: Whether to register for events or not
 * eventTimeout: Interval in seconds for polling the server for new events
 * (Default: 10)
 *
 * You may set other parameters here which will be passed to the
 * http/https request (e.g. SSL/TLS settings)
 *
 */
var client = new Nxt({
  protocol: 'http',
  host: 'de009.static.nxt-nodes.net',
  port: 7876,
  eventLoop: true,
  eventTimeout: 300, // 5 min
});

/**
 * Let's do an API request
 */
client.request('getPeers', { active: true }, function(data) {
  console.log(
    '%d active peers found.',
    data.peers.length
  );
});

/**
 * Let's get notified when new Nxt blocks are forged
 * For a list of possible events see:
 * https://nxtwiki.org/wiki/The_Nxt_API#Event_Register
 */
client.event.on('Block.BLOCK_PUSHED', function(data) {
  console.log(
    '%d new block(s) - Block ID(s): ',
    data.length,
    data
  );
});

/**
 * Error handler
 */
client.event.on('error', function(err) {
  // An error occured
  console.log(err);
});

/**
 * Exit
 * exit(true) will force exit (close TCP socket immediately)
 */
setTimeout(function() {
  console.log('Exiting ...');
  client.exit();
}, 10000);
