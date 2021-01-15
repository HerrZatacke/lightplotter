const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const defaultParams = require('../web/javascript/tools/defaultParams');
const calculateStats = require('../web/javascript/tools/calculateStats');
// const getOs = require('../../scripts/tools/getOs');

const file = fs.createWriteStream(path.join(process.cwd(), '/src/embedded/lightplotter/shape.h'));
file.write('\nuint32_t shape[][3] = {\n');

const factor = 3600 / 220; // 3600 ticks per revolution by winch circumference

let maxL = -Infinity;
let minL = Infinity;
let maxR = -Infinity;
let minR = Infinity;

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
      ropes: {
        l: 1000,
        r: 1000,
      },
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

  pointFromRopes({ ll, lr }) {
    const c = this.status.params.width - this.status.params.gondolaWidth;
    const y = ll * Math.sin(Math.acos(((lr ** 2) - (ll ** 2) - (c ** 2)) / (-2 * ll * c)));
    const x = Math.sqrt((ll ** 2) - (y ** 2)) + (this.status.params.gondolaWidth / 2);

    return {
      x,
      y,
    };
  }

  updateStatus(changes) {
    Object.assign(this.status, changes);

    if (changes.ropes !== undefined) {
      Object.assign(changes, {
        point: this.pointFromRopes(changes.ropes),
        ropes: undefined,
      });
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

    const point = this.points[this.status.offset];

    if (!point) {
      this.stopAnimation();
      return;
    }

    const offset = (this.status.offset + 1) % this.points.length;
    const { ll, lr } = calculateStats(point, this.status.params);
    const { color } = point;

    // const llDiff = this.status.ropes.ll - ll;
    // const lrDiff = this.status.ropes.lr - lr;
    // const delay = Math.ceil(Math.abs(llDiff) + Math.abs(lrDiff)) * 7;

    const delay = 1;

    // eslint-disable-next-line no-console
    console.info(`Moving to x:${point.x} y:${point.y} ${offset}/${this.points.length} | left:${ll} right:${lr} | (${(offset / this.points.length * 100).toFixed(1)}%) | delay:${delay}ms`);

    const calcLeft = (1530 - ll) * factor;
    const calcRight = (1530 - lr) * factor;

    maxL = Math.max(maxL, calcLeft);
    minL = Math.min(minL, calcLeft);
    maxR = Math.max(maxR, calcRight);
    minR = Math.min(minR, calcRight);

    const txt = `  {${Math.round(calcLeft)}, ${Math.round(calcRight)}, ${color}},\n`;
    file.write(txt);

    this.updateStatus({
      offset,
      ropes: {
        ll,
        lr,
      },
    });

    const atLastPoint = this.status.offset === 0;

    this.renderTimeout = global.setTimeout(() => {
      if (!atLastPoint) {
        this.startAnimation();
      } else {
        file.write(`};\n\n#define SHAPE_SIZE ${this.points.length}\nint shapeIndex = 1 + SHAPE_SIZE;\n// max left: ${maxL}\n// min left: ${minL}\n// max right: ${maxR}\n// min right: ${minR}\n\n`);
        this.stopAnimation();
      }
    }, delay);
  }
}

module.exports = Writer;
