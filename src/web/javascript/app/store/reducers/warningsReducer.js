const warningsReducer = (value = [], action) => {
  switch (action.type) {
    case 'SET_POSITION':
      return action.warnings;
    default:
      return value;
  }
};

export default warningsReducer;
