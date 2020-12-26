const paramsReducer = (value = {
  width: 1200, // mm
  height: 800, // mm
  gondolaWidth: 200, // mm
  winchRadius: 20, // mm
  weight: 2, // kg
  // rpm: 250, // estimated / for 1:30 gear motor (no load speed 330rpm)
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
