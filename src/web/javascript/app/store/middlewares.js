import { applyMiddleware } from 'redux';
import fileDrop from './middlewares/fileDrop';
import handleSocketUpdates from './middlewares/handleSocketUpdates';
import updateParams from './middlewares/updateParams';
import validatePosition from './middlewares/validatePosition';

export default applyMiddleware(
  fileDrop,
  handleSocketUpdates,
  updateParams,
  validatePosition,
);
