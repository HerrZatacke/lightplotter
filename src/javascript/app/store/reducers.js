import { combineReducers } from 'redux';
import position from './reducers/positionReducer';
import weight from './reducers/weightReducer';

export default combineReducers({
  position,
  weight,
});
