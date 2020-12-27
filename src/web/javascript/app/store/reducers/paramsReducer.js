const paramsReducer = (value = null, action) => {
  switch (action.type) {
    case 'UPDATE_PARAMS':
      return {
        ...value,
        ...action.params,
      };
    default:
      return value;
  }
};

export default paramsReducer;
