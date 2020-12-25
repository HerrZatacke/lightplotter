const weightReducer = (value = 2, action) => {
  switch (action.type) {
    case 'SET_WEIGHT':
      return action.weight;
    default:
      return value;
  }
};

export default weightReducer;
