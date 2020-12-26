const paramsReducer = (value = {
  width: 1200, // mm
  height: 800, // mm
  gondolaWidth: 200, // mm
  winchRadius: 35, // mm
  weight: 2, // kg
  rpm: 150, // estimated / for 1:50 gear motor (no load speed 200rpm)
}, action) => {
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
