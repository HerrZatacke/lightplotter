import { applyMiddleware } from 'redux';
import fileDrop from './middlewares/fileDrop';
import validatePosition from './middlewares/validatePosition';

export default applyMiddleware(
  fileDrop,
  validatePosition,
);
