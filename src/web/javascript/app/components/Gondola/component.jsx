import React from 'react';
import PropTypes from 'prop-types';

const Gondola = ({ stats: { x, y, lwr, rwr }, params: { gondolaWidth, winchRadius } }) => {

  const lx = x - (gondolaWidth / 2);
  const rx = x + (gondolaWidth / 2);

  return (
    <g className="gondola">
      <circle cx={lx} cy={y} r="1.5" fill="#000" />
      <circle cx={rx} cy={y} r="1.5" fill="#000" />

      <line x1={x - (gondolaWidth / 2)} x2={x - (gondolaWidth / 2)} y1={y} y2={y + winchRadius + 15} />
      <line x1={x + (gondolaWidth / 2)} x2={x + (gondolaWidth / 2)} y1={y} y2={y + winchRadius + 15} />

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

      <circle className="gondola__light" cx={x} cy={y} r={5} />
    </g>
  );
};

Gondola.propTypes = {
  stats: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    lwr: PropTypes.number.isRequired,
    rwr: PropTypes.number.isRequired,
  }).isRequired,
  params: PropTypes.shape({
    gondolaWidth: PropTypes.number.isRequired,
    winchRadius: PropTypes.number.isRequired,
  }).isRequired,
};

Gondola.defaultProps = {
};

export default Gondola;
