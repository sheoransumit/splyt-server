/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var redisApp = require('redis');
var redis = require('socket.io-redis');
// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/youtube/youtube.socket').register(socket);
  require('../api/song/song.socket').register(socket);
  require('../api/playlist/playlist.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
  require('../api/user/user.socket').register(socket);
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });

  if(process.env.NODE_ENV === 'production') {
    console.log('config.redis', config.redis)
    var socketpub = redisApp.createClient(config.redis.port, config.redis.host, {auth_pass: config.redis.pass, return_buffers: true});
    var socketsub = redisApp.createClient(config.redis.port, config.redis.host, {auth_pass: config.redis.pass, detect_buffers: true});
    var client = redisApp.createClient(config.redis.port, config.redis.host, {auth_pass: config.redis.pass, return_buffers: true});
    socketio.adapter(redis({
     pubClient: socketpub,
     subClient: socketsub,
     redisClient: client
    }));
  } else {
   socketio.adapter(redis(config.redis));
  }
};
