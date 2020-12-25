import React from 'react';
import PropTypes from 'prop-types';
import Nacelle from '../Nacelle';

const Display = ({ position: { x, y }, params: { width, height, nacelleWidth }, setPosition }) => {

  const [active, setActive] = React.useState(false);

  const handlePointerDown = (ev) => {
    const el = ev.target;
    const rect = el.getBoundingClientRect();
    setPosition(ev.clientX - rect.left, ev.clientY - rect.top);
    el.setPointerCapture(ev.pointerId);
    setActive(true);
  };

  const handlePointerMove = (ev) => {
    if (active) {
      const rect = ev.target.getBoundingClientRect();
      setPosition(ev.clientX - rect.left, ev.clientY - rect.top);
    }
  };

  const handlePointerUp = () => {
    setActive(false);
  };

  return (
    <svg
      className="display"
      width={width}
      height={height}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <g
        stroke="#000"
        strokeWidth="0.25"
        fill="none"
        className="display__ropes"
      >
        <line x1={x - (nacelleWidth / 2)} y1={y} x2={0} y2={0} />
        <line x1={x + (nacelleWidth / 2)} y1={y} x2={width} y2={0} />
      </g>
      <Nacelle />
    </svg>
  );
};

Display.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  params: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    nacelleWidth: PropTypes.number.isRequired,
  }).isRequired,
  setPosition: PropTypes.func.isRequired,
};

Display.defaultProps = {
};

export default Display;
