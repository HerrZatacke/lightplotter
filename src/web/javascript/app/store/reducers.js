import { combineReducers } from 'redux';
import animationRunning from './reducers/animationRunningReducer';
import dragover from './reducers/dragoverReducer';
import hasConnection from './reducers/hasConnectionReducer';
import offset from './reducers/offsetReducer';
import params from './reducers/paramsReducer';
import position from './reducers/positionReducer';
import serverBusy from './reducers/serverBusyReducer';
import warnings from './reducers/warningsReducer';

export default combineReducers({
  animationRunning,
  dragover,
  hasConnection,
  offset,
  params,
  position,
  serverBusy,
  warnings,
});
