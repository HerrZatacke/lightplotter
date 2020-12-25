import React from 'react';
import PropTypes from 'prop-types';

const Display = ({ position: { x, y }, setPosition }) => {

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
      width={1200}
      height={800}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <g
        stroke="#000"
        strokeWidth="0.25"
        fill="none"
      >
        <circle cx={x} cy={y} r="4" />
        <line x1={x} y1={y} x2={0} y2={0} />
        <line x1={x} y1={y} x2={1200} y2={0} />
      </g>
    </svg>
  );
};

Display.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  setPosition: PropTypes.func.isRequired,
};

Display.defaultProps = {
};

export default Display;
