import React from 'react';
import PropTypes from 'prop-types';

const Stats = ({ stats: { x, y, ll, lr, al, ar, w, fd, fl, fr } }) => (
  <table className="stats">
    <tbody>
      <tr>
        <th>x</th>
        <td>{x}</td>
      </tr>
      <tr>
        <th>y</th>
        <td>{y}</td>
      </tr>
      <tr>
        <th>Length left</th>
        <td>{ll.toFixed(2)}</td>
      </tr>
      <tr>
        <th>∠ left</th>
        <td>{`${al.toFixed(2)}°`}</td>
      </tr>
      <tr>
        <th>Length right</th>
        <td>{lr.toFixed(2)}</td>
      </tr>
      <tr>
        <th>∠ right</th>
        <td>{`${ar.toFixed(2)}°`}</td>
      </tr>
      <tr>
        <th>Weight</th>
        <td>{`${w.toFixed(2)}kg`}</td>
      </tr>
      <tr>
        <th>Force down</th>
        <td>{`${fd.toFixed(2)}N`}</td>
      </tr>
      <tr>
        <th>Force left</th>
        <td>{`${fl.toFixed(2)}N`}</td>
      </tr>
      <tr>
        <th>Force right</th>
        <td>{`${fr.toFixed(2)}N`}</td>
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
  }).isRequired,
};

Stats.defaultProps = {
};

export default Stats;
