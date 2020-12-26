import { combineReducers } from 'redux';
import dragover from './reducers/dragoverReducer';
import points from './reducers/pointsReducer';
import params from './reducers/paramsReducer';
import position from './reducers/positionReducer';

export default combineReducers({
  dragover,
  points,
  params,
  position,
});
