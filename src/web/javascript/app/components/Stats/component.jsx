import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';
import EditButton from './EditButton';

const Stats = ({
  stats: { x, y, ll, lr, al, ar, w, gw, fd, fl, fr, wc, wr, rpm, ms, tl, tr },
  run,
  stop,
  updateParam,
  warnings,
  hasConnection,
  serverBusy,
  animationRunning,
}) => (
  <table className="stats">
    <tbody>
      <tr className="stats__row stats__row--border">
        <th>1px = 1mm</th>
        <td colSpan="2" />
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('x'),
      })}
      >
        <th>Position x</th>
        <td>{`${x.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className={classNames('stats__row stats__row--border', {
        'stats__row--warn': warnings.includes('y'),
      })}
      >
        <th>Position y</th>
        <td>{`${y.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('w'),
      })}
      >
        <th>Weight</th>
        <td>{`${w.toFixed(2)}kg`}</td>
        <td>
          <EditButton updateParam={updateParam} paramKey="weight" />
        </td>
      </tr>
      <tr className={classNames('stats__row stats__row--border', {
        'stats__row--warn': warnings.includes('gw'),
      })}
      >
        <th>Force down</th>
        <td>{`${fd.toFixed(2)}N`}</td>
        <td />
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('gw'),
      })}
      >
        <th>Gondola Width</th>
        <td>{`${gw.toFixed(0)}mm`}</td>
        <td>
          <EditButton updateParam={updateParam} paramKey="gondolaWidth" />
        </td>
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('wr'),
      })}
      >
        <th>Winch Radius</th>
        <td>{`${wr.toFixed(0)}mm`}</td>
        <td>
          <EditButton updateParam={updateParam} paramKey="winchRadius" />
        </td>
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('wc'),
      })}
      >
        <th>Winch Circumference</th>
        <td>{`${wc.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('rpm'),
      })}
      >
        <th>Motor max. rpm</th>
        <td>{`${rpm.toFixed()}rpm`}</td>
        <td>
          <EditButton updateParam={updateParam} paramKey="rpm" />
        </td>
      </tr>
      <tr className={classNames('stats__row stats__row--border', {
        'stats__row--warn': warnings.includes('ms'),
      })}
      >
        <th>Max Speed</th>
        <td>{`${ms.toFixed(2)}m/s`}</td>
        <td>{`${(ms * 3.6).toFixed(2)}km/h`}</td>
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('ll'),
      })}
      >
        <th>Length left</th>
        <td>{`${ll.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('al'),
      })}
      >
        <th>Angle left</th>
        <td>{`${al.toFixed(2)}°`}</td>
        <td />
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes(''),
      })}
      >
        <th>Length right</th>
        <td>{`${lr.toFixed(0)}mm`}</td>
        <td />
      </tr>
      <tr className={classNames('stats__row stats__row--border', {
        'stats__row--warn': warnings.includes('ar'),
      })}
      >
        <th>Angle right</th>
        <td>{`${ar.toFixed(2)}°`}</td>
        <td />
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('fl'),
      })}
      >
        <th>Force left</th>
        <td>{`${fl.toFixed(2)}N`}</td>
        <td>{`${(fl / 9.80665).toFixed(2)}kg`}</td>
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('fr'),
      })}
      >
        <th>Force right</th>
        <td>{`${fr.toFixed(2)}N`}</td>
        <td>{`${(fr / 9.80665).toFixed(2)}kg`}</td>
      </tr>
      <tr className={classNames('stats__row', {
        'stats__row--warn': warnings.includes('tl'),
      })}
      >
        <th>Torque left</th>
        <td>{`${tl.toFixed(2)}Nm`}</td>
        <td>{`${(tl * 10.19716).toFixed(2)}kg•cm`}</td>
      </tr>
      <tr className={classNames('stats__row stats__row--border', {
        'stats__row--warn': warnings.includes('tr'),
      })}
      >
        <th>Torque right</th>
        <td>{`${tr.toFixed(2)}Nm`}</td>
        <td>{`${(tr * 10.19716).toFixed(2)}kg•cm`}</td>
      </tr>

      { hasConnection ? (
        <tr className="stats__row stats__row--border">
          <td colSpan={3}>
            <button
              disabled={serverBusy || animationRunning}
              type="button"
              onClick={run}
            >
              Run!
            </button>
            <button
              disabled={serverBusy}
              type="button"
              onClick={stop}
            >
              Stop!
            </button>
          </td>
        </tr>
      ) : null }
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
    gw: PropTypes.number.isRequired,
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
  stop: PropTypes.func.isRequired,
  updateParam: PropTypes.func.isRequired,
  warnings: PropTypes.array.isRequired,
  hasConnection: PropTypes.bool.isRequired,
  serverBusy: PropTypes.bool.isRequired,
  animationRunning: PropTypes.bool.isRequired,
};

Stats.defaultProps = {
};

export default Stats;
