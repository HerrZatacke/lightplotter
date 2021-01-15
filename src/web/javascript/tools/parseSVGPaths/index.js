const color = require('color');

const tmpSVG = document.createElement('svg');
document.body.appendChild(tmpSVG);

const parseSVGPaths = (paths) => (
  paths.map((path) => {

    tmpSVG.appendChild(path);

    const r = (parseInt(window.getComputedStyle(path).strokeWidth, 10) || 4) / 2;
    let computedColor = 0;
    return (
      Array(Math.ceil(path.getTotalLength()))
        .fill(null)
        .map((_, index) => {

          if (index % 5) {
            return null;
          }

          const point = path.getPointAtLength(index);
          const pointData = {
            x: Math.round(point.x),
            y: Math.round(point.y),
            r,
            color: color(computedColor).rgbNumber(),
          };

          computedColor = window.getComputedStyle(path).stroke || '#f00';

          return pointData;
        })
        .filter(Boolean)
    );
  })
);

export default parseSVGPaths;
