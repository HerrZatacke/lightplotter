import React from 'react';
import PropTypes from 'prop-types';

const Stats = ({ stats: { x, y, ll, lr, al, ar, w, fd, fl, fr, wc, wr, rpm, ms, tl, tr }, run }) => (
  <table className="stats">
    <tbody>
      <tr className="stats__row stats__row--border">
        <th>1px = 1mm</th>
        <td colSpan="2" />
      </tr>
      <tr className="stats__row">
        <th>Position x</th>
        <td>{`${x.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className="stats__row stats__row--border">
        <th>Position y</th>
        <td>{`${y.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className="stats__row">
        <th>Weight</th>
        <td>{`${w.toFixed(2)}kg`}</td>
        <td />
      </tr>
      <tr className="stats__row stats__row--border">
        <th>Force down</th>
        <td>{`${fd.toFixed(2)}N`}</td>
        <td />
      </tr>
      <tr className="stats__row">
        <th>Winch Circumference</th>
        <td>{`${wc.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className="stats__row">
        <th>Winch Radius</th>
        <td>{`${wr.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className="stats__row">
        <th>Motor max. rpm</th>
        <td>{`${rpm.toFixed()}rpm`}</td>
        <td />
      </tr>
      <tr className="stats__row stats__row--border">
        <th>Max Speed</th>
        <td>{`${ms.toFixed(2)}m/s`}</td>
        <td>{`${(ms * 3.6).toFixed(2)}km/h`}</td>
      </tr>
      <tr className="stats__row">
        <th>Length left</th>
        <td>{`${ll.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className="stats__row">
        <th>Angle left</th>
        <td>{`${al.toFixed(2)}°`}</td>
        <td />
      </tr>
      <tr className="stats__row">
        <th>Length right</th>
        <td>{`${lr.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className="stats__row stats__row--border">
        <th>Angle right</th>
        <td>{`${ar.toFixed(2)}°`}</td>
        <td />
      </tr>
      <tr className="stats__row">
        <th>Force left</th>
        <td>{`${fl.toFixed(2)}N`}</td>
        <td>{`${(fl / 9.80665).toFixed(2)}kg`}</td>
      </tr>
      <tr className="stats__row">
        <th>Force right</th>
        <td>{`${fr.toFixed(2)}N`}</td>
        <td>{`${(fr / 9.80665).toFixed(2)}kg`}</td>
      </tr>
      <tr className="stats__row">
        <th>Torque left</th>
        <td>{`${tl.toFixed(2)}Nm`}</td>
        <td>{`${(tl * 10.19716).toFixed(2)}kg•cm`}</td>
      </tr>
      <tr className="stats__row stats__row--border">
        <th>Torque right</th>
        <td>{`${tr.toFixed(2)}Nm`}</td>
        <td>{`${(tr * 10.19716).toFixed(2)}kg•cm`}</td>
      </tr>

      <tr className="stats__row">
        <td colSpan={2}>
          <button
            type="button"
            onClick={run}
          >
            Run!
          </button>
        </td>
      </tr>
    </tbody>
  </table>
);

Stats.propTypes = {
  stats: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    ll: PropTypes.number.isRequired,
    lr: PropTypes.number.isRequired,
    al: PropTypes.number.isRequired,
    ar: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    fd: PropTypes.number.isRequired,
    fl: PropTypes.number.isRequired,
    fr: PropTypes.number.isRequired,
    wc: PropTypes.number.isRequired,
    wr: PropTypes.number.isRequired,
    rpm: PropTypes.number.isRequired,
    ms: PropTypes.number.isRequired,
    tl: PropTypes.number.isRequired,
    tr: PropTypes.number.isRequired,
  }).isRequired,
  run: PropTypes.func.isRequired,
};

Stats.defaultProps = {
};

export default Stats;
