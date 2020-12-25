const positionReducer = (value = { x: 250, y: 700 }, action) => {
  switch (action.type) {
    case 'SET_POSITION':
      return action.position;
    default:
      return value;
  }
};

export default positionReducer;
