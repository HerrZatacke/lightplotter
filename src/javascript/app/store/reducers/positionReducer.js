const positionReducer = (value = { x: 600, y: 350 }, action) => {
  switch (action.type) {
    case 'SET_POSITION':
      return action.position;
    default:
      return value;
  }
};

export default positionReducer;
