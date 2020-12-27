const chalk = require('chalk');
// const getOs = require('../../scripts/tools/getOs');

class Writer {

  constructor({ socket }) {
    if (!socket) {
      throw new Error('Socket missing');
    }

    this.socket = socket;
    this.renderTimeout = null;
    this.points = [];

    this.status = {
      offset: 0,
      canAcceptNewImage: true,
      isRunning: false,
      // hasConnection: false,
    };
  }

  init() {
    // trap the SIGINT and reset before exit
    process.on('SIGINT', () => {
      console.log('exiting...');
    });

    this.bindSocketEvents();
    this.sendStatus(this.status);
  }

  bindSocketEvents() {
    this.socket.on('connection', (ws) => {
      ws.on('message', (received) => {

        if (received instanceof Buffer) {
          console.log(received);
        } else {
          const message = JSON.parse(received);

          Object.keys(message).forEach((action) => {
            // const payload = message[action];
            switch (action) {
              case 'start':
                this.start();
                break;
              case 'stop':
                this.stop();
                break;
              default:
                break;
            }
          });
        }
      });

      ws.send(JSON.stringify(this.status));
    });
  }

  updateStatus(changes, dontSend = false) {
    Object.assign(this.status, changes);

    if (!dontSend) {
      this.sendStatus(changes);
    }
  }

  sendStatus(changes) {
    this.socket.clients.forEach((ws) => {
      ws.send(JSON.stringify(changes));
    });
  }

  start() {
    if (this.status.isRunning /* || !this.status.hasConnection */) {
      return;
    }

    this.updateStatus({
      isRunning: true,
    });

    global.setTimeout(() => {
      this.startAnimation();
    }, 1000);
  }

  stop() {
    this.stopAnimation();
  }

  stopAnimation() {
    global.clearTimeout(this.renderTimeout);
    this.renderTimeout = null;
    this.updateStatus({
      isRunning: false,
      offset: 0,
    });
  }

  startAnimation() {
    global.clearTimeout(this.renderTimeout);
    if (this.points.length < 2) {
      this.stopAnimation();
      return;
    }

    const delay = Math.floor(1000 / this.status.fps);

    const point = this.points[this.status.offset];

    if (!point) {
      this.stopAnimation();
      return;
    }

    const offset = (this.status.offset + 1) % this.points.length;
    this.updateStatus({
      offset,
    }, (delay <= 10 && offset % 2 !== 0));


    const atLastCol = this.status.offset === 0;

    this.renderTimeout = global.setTimeout(() => {
      if (!atLastCol) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    }, delay);
  }
}

module.exports = Writer;
