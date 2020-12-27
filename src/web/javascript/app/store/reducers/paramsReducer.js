const paramsReducer = (params = null, action) => {
  switch (action.type) {
    case 'UPDATE_PARAMS':
      return {
        ...params,
        ...action.params,
      };
    case 'SERVER_MESSAGE':
      return action.params !== undefined ? action.params : params;
    default:
      return params;
  }
};

export default paramsReducer;
