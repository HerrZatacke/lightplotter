const WebSocket = require('ws');

const Writer = require('./Writer');

const writerSocket = new WebSocket.Server({ port: 3001 });

const writer = new Writer({
  socket: writerSocket,
});

writer.init();

module.exports = writerSocket;
