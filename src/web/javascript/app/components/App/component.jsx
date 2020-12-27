import React from 'react';
import PropTypes from 'prop-types';
import Display from '../Display';
import Stats from '../Stats';
import DragOver from '../DragOver';

const App = ({ hasParams }) => (
  hasParams ? (
    <div className="app">
      <Display />
      <Stats />
      <DragOver />
    </div>
  ) : null
);

App.propTypes = {
  hasParams: PropTypes.bool.isRequired,
};

App.defaultProps = {};

export default App;
