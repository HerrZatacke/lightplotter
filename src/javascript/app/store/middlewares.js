import { applyMiddleware } from 'redux';
import fileDrop from './middlewares/fileDrop';
import updateParams from './middlewares/updateParams';
import validatePosition from './middlewares/validatePosition';

export default applyMiddleware(
  fileDrop,
  updateParams,
  validatePosition,
);
