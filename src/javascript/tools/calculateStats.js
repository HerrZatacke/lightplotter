const calculateStats = ({ x, y }, w) => {

  // 1Nm = 10.19716kg*cm
  // 1kg*cm = 0.0980665Nm

  // length left rope
  const ll = Math.sqrt((x ** 2) + (y ** 2));
  // length right rope
  const lr = Math.sqrt(((1200 - x) ** 2) + (y ** 2));

  // angle left side
  const al = Math.atan2(y, x) * 180 / Math.PI;
  // angle right side
  const ar = Math.atan2(y, 1200 - x) * 180 / Math.PI;

  // force down
  const fd = w * 9.80665;
  // force left side
  const fl = fd / (2 * Math.sin(Math.atan2(y, x)));
  // force rigt side
  const fr = fd / (2 * Math.sin(Math.atan2(y, 1200 - x)));

  return ({
    x,
    y,
    w,
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
