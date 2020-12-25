import React from 'react';
import PropTypes from 'prop-types';

const Nacelle = ({ stats: { x, y, lwr, rwr }, params: { nacelleWidth, winchRadius } }) => {

  const lx = x - (nacelleWidth / 2);
  const rx = x + (nacelleWidth / 2);

  return (
    <g className="nacelle">
      <circle cx={lx} cy={y} r="1.5" fill="#000" />
      <circle cx={rx} cy={y} r="1.5" fill="#000" />

      <line x1={x - 0.5 - (nacelleWidth / 2)} x2={x - 0.5 - (nacelleWidth / 2)} y1={y} y2={y + winchRadius + 15} />
      <line x1={x + 0.5 + (nacelleWidth / 2)} x2={x + 0.5 + (nacelleWidth / 2)} y1={y} y2={y + winchRadius + 15} />

      <g
        strokeWidth="1"
        transform={`translate(${lx - winchRadius},${y + winchRadius + 15}) rotate(${-lwr})`}
      >
        <circle cx={0} cy={0} r={winchRadius} />
        <line x1={0} x2={0} y1={-winchRadius} y2={winchRadius} />
        <line x1={-winchRadius} x2={winchRadius} y1={0} y2={0} />
      </g>

      <g
        strokeWidth="1"
        transform={`translate(${rx + winchRadius},${y + winchRadius + 15}) rotate(${rwr})`}
      >
        <circle cx={0} cy={0} r={winchRadius} />
        <line x1={0} x2={0} y1={-winchRadius} y2={winchRadius} />
        <line x1={-winchRadius} x2={winchRadius} y1={0} y2={0} />
      </g>
    </g>
  );
};

Nacelle.propTypes = {
  stats: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    lwr: PropTypes.number.isRequired,
    rwr: PropTypes.number.isRequired,
  }).isRequired,
  params: PropTypes.shape({
    nacelleWidth: PropTypes.number.isRequired,
    winchRadius: PropTypes.number.isRequired,
  }).isRequired,
};

Nacelle.defaultProps = {
};

export default Nacelle;
