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
      <g className="display__ropes">
        <line x1={x - (nacelleWidth / 2)} y1={y} x2={0} y2={0} />
        <line x1={x + (nacelleWidth / 2)} y1={y} x2={width} y2={0} />
      </g>

      <g className="display__path">
        <path d="M467.628 298.233l-6.678 8.218m96.734 3.636l-6.678 8.217" stroke="#69d" strokeWidth="35" />
        <path d="M660.675 466.456l-1.145 1.362M648.021 459.664l.688-.834M688.58 511.66l-2.558-.969M673.893 549.941l-1.27-2.422M678.104 530.598l-1.528 1.431M638.408 467.927l2.309 1.39M655.005 514.25l1.334-1.525M643.693 537.252l-1.786 2.071M647.415 559.061l2.488-.122M660.963 575.064l1.622-.212" stroke="#ff0" strokeWidth="3" />
        <path d="M567.018 356.064c-38.147 4.575-78.816 4.7-118.159 1.243M512.704 327.218c8.324 6.596-27.303 19.78-27.06 9.968-.256-5.943 19.27-16.065 26.265-28.085M677.22 480.94c18.272-30.1 37.755-56.07 52.622-87.968 8.86-24.1 38.328-12.892 33.252 10.44-5.564 22.756-21.347 54.933-32.406 67.34 5.904 4.218 41.115-.705 33.852 19.02-5.015 6.76-13.243 8.303-20.409 6.826 41.427 23.688 17.327 43.974-20.56 38.588M507.071 582.932c-7.869 12.42-10.277 51.96-31.114 34.497-7.447-9.155-29.803-16.633-19.884 3.065 5.6 14.212 27.797 50.298 37.81 32.837 13.644-20.503 26.911-41.262 39.056-62.687M551.845 408.552c-.838 29.513-1.159 66.086-4.003 95.485-11.31 2.502-32.955 27.371-3.464 22.562 12.725 20.681 17.37 3.795 19.56-9.066 18.605 17.887 26.191-4.636 7.92-15.045-15.045-13.443-3.572-41.992-3.073-54.059 1.226-10.64 2.588-21.266 3.705-31.917M499.146 313.114c6.673-17.673-10.7-33.579-29.672-31.67-17.773 1.788-29.003 18.425-21.794 33.537 8.685 18.209 44.327 17.042 51.466-1.867z" stroke="#999" />
        <path d="M585.572 330.993c18.772-12.415 3.251-35.909-13.505-39.485-20.886-4.457-40.926 16.747-35.233 34.312 5.692 17.564 34.68 14.47 48.738 5.173z" stroke="#fff" />
        <path d="M691.585 458.602c-25.297-15.59-43.55-12.495-66.337-3.009-7.01 4.244-25.27 9.45-20.358 19.921-8.665-30.555 1.688-69.165 4.62-99.726 2.967-35.94 8.544-61.306-5.356-108.112-12.5-23.275-35.302-34.72-58.355-31.169-27.379 4.584-51.233 23.739-68.195 44.923" stroke="#fff" />
        <path d="M458.664 325.57c-2.443 7.079-5.57 17.025-9.805 31.737-4.235 14.712-18.575 42.94-13.387 85.636 5.271 43.39 11.34 58.04 28.402 98.292 8.247 19.455 34.174 38.955 53.343 45.477 25.958 8.832 57.658 9.79 84.82 12.733-1.853 45.42-32.152 9.29-33.015 25.727 2.156 17.44 27.766 42.53 37.913 44.695 10.186-.917 17.201-44.146 20.55-67.67 1.764-12.852 31.038-4.245 46.228-10.88 21.804-10.258 41.696-32.95 49.191-53.95 3.661-18.137-4.346-34.965-18.982-47.436-20.294-12.554-48.439-13.089-73.53-.173" stroke="#fff" />
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
