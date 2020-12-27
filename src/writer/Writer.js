const chalk = require('chalk');
const defaultParams = require('../web/javascript/tools/defaultParams');
const calculateStats = require('../web/javascript/tools/calculateStats');
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
      point: { x: 250, y: 700 },
      params: defaultParams,
    };
  }

  init() {
    // trap the SIGINT and reset before exit
    process.on('SIGINT', () => {
      // eslint-disable-next-line no-console
      console.info('exiting...');
    });

    this.bindSocketEvents();
    this.sendStatus(this.status);
  }

  bindSocketEvents() {
    this.socket.on('connection', (ws) => {
      ws.on('message', (received) => {
        const message = JSON.parse(received);

        Object.keys(message).forEach((action) => {
          switch (action) {
            case 'start':
              this.start();
              break;
            case 'stop':
              this.stop();
              break;
            case 'params':
              this.setParams(message.params);
              break;
            case 'points':
              this.setPoints(message.points);
              break;
            default:
              break;
          }
        });
      });

      ws.send(JSON.stringify(this.status));
    });
  }

  updateStatus(changes) {
    Object.assign(this.status, changes);

    if (changes.offset !== undefined) {
      Object.assign(changes, { point: this.status.point });
    }

    this.sendStatus(changes);
  }

  sendStatus(changes) {
    this.socket.clients.forEach((ws) => {
      ws.send(JSON.stringify(changes));
    });
  }

  setParams(params) {
    this.updateStatus({
      params: {
        ...this.status.params,
        ...params,
      },
    });
  }

  setPoints(points) {
    if (this.status.isRunning) {
      return;
    }

    if (!this.status.canAcceptNewImage) {
      return;
    }

    this.points = [];
    this.updateStatus({
      canAcceptNewImage: false,
    });

    // eslint-disable-next-line no-console
    console.info(chalk.blue(`loading ${points.length} points`));

    // read a file after a second
    global.clearTimeout(this.loadTimeout);
    this.loadTimeout = global.setTimeout(() => {
      this.points = points;

      // eslint-disable-next-line no-console
      console.info(chalk.blue(`${points.length} points loaded`));

      this.updateStatus({
        canAcceptNewImage: true,
      });
    }, 100);
  }

  start() {
    if (this.status.isRunning) {
      return;
    }

    this.updateStatus({
      isRunning: true,
    });

    this.startAnimation();
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

    const delay = 20;

    const point = this.points[this.status.offset];

    if (!point) {
      this.stopAnimation();
      return;
    }

    const offset = (this.status.offset + 1) % this.points.length;

    const { ll, lr } = calculateStats(point, this.status.params);

    // eslint-disable-next-line no-console
    console.info(`Moving to x:${point.x} y:${point.y} ${offset}/${this.points.length} | left:${ll} right:${lr} | (${(offset / this.points.length * 100).toFixed(1)}%)`);

    this.updateStatus({
      offset,
      point,
    });

    const atLastPoint = this.status.offset === 0;

    this.renderTimeout = global.setTimeout(() => {
      if (!atLastPoint) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    }, delay);
  }
}

module.exports = Writer;
