const pointsReducer = (value = [], action) => {
  switch (action.type) {
    case 'SET_POINTS':
      return action.points;
    default:
      return value;
  }
};

export default pointsReducer;
