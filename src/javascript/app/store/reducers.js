import { combineReducers } from 'redux';
import params from './reducers/paramsReducer';
import position from './reducers/positionReducer';

export default combineReducers({
  params,
  position,
});
