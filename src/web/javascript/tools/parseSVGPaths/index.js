const parseSVGPaths = (paths) => (
  paths.map((path) => {
    const r = (parseInt(window.getComputedStyle(path).strokeWidth, 10) || 4) / 2;
    const color = window.getComputedStyle(path).stroke || '#f00';
    return (
      Array(Math.ceil(path.getTotalLength()))
        .fill(null)
        .map((_, index) => {

          // if (index % 5) {
          //   return null;
          // }

          const point = path.getPointAtLength(index);
          return {
            x: Math.round(point.x),
            y: Math.round(point.y),
            r,
            color,
          };
        })
        .filter(Boolean)
    );
  })
);

export default parseSVGPaths;
