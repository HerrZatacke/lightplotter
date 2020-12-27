import React from 'react';
import Display from '../Display';
import Stats from '../Stats';
import DragOver from '../DragOver';
// import PropTypes from 'prop-types';

const App = () => (
  <div className="app">
    <Display />
    <Stats />
    <DragOver />
  </div>
);

App.propTypes = {};

App.defaultProps = {};

export default App;
