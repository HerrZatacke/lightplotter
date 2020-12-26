const calculateStats = ({ x, y }, { width, weight, nacelleWidth, winchRadius, rpm }) => {

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

  // torque right
  const tr = fr * winchRadius / 1000;
  // torque left
  const tl = fl * winchRadius / 1000;

  // winch circumference
  const wc = 2 * winchRadius * Math.PI;
  // left winch rotation
  const lwr = ll / wc * 360;
  // right winch rotation
  const rwr = lr / wc * 360;

  // max speed m/s
  const ms = wc * rpm / 60 / 1000;

  return ({
    x,
    y,
    w: weight,
    rpm,
    ms,
    ll,
    lr,
    al,
    ar,
    fd,
    fl,
    fr,
    wc,
    wr: winchRadius,
    lwr,
    rwr,
    tr,
    tl,
  });
};

export default calculateStats;
