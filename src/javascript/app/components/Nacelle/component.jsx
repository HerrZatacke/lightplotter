import React from 'react';
import PropTypes from 'prop-types';

const Nacelle = ({ position: { x, y }, params: { nacelleWidth } }) => (
  <g
    stroke="#000"
    strokeWidth="0.25"
    fill="none"
    className="nacelle"
  >
    <circle cx={x - (nacelleWidth / 2)} cy={y} r="1.5" fill="#000" />
    <circle cx={x + (nacelleWidth / 2)} cy={y} r="1.5" fill="#000" />
  </g>
);

Nacelle.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  params: PropTypes.shape({
    nacelleWidth: PropTypes.number.isRequired,
  }).isRequired,
};

Nacelle.defaultProps = {
};

export default Nacelle;
