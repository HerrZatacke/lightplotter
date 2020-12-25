const calculateStats = ({ x, y }, { width, weight, nacelleWidth }) => {

  // 1Nm = 10.19716kg*cm
  // 1kg*cm = 0.0980665Nm

  // left x position
  const lx = x - (nacelleWidth / 2);
  // right x position
  const rx = x + (nacelleWidth / 2);

  // length left rope
  const ll = Math.sqrt((lx ** 2) + (y ** 2));
  // length right rope
  const lr = Math.sqrt(((width - rx) ** 2) + (y ** 2));

  // angle left side
  const al = Math.atan2(y, lx) * 180 / Math.PI;
  // angle right side
  const ar = Math.atan2(y, width - rx) * 180 / Math.PI;

  // force down
  const fd = weight * 9.80665;
  // force left side
  const fl = fd / (2 * Math.sin(Math.atan2(y, lx)));
  // force rigt side
  const fr = fd / (2 * Math.sin(Math.atan2(y, width - rx)));

  return ({
    x,
    y,
    w: weight,
    ll,
    lr,
    al,
    ar,
    fd,
    fl,
    fr,
  });
};

export default calculateStats;
