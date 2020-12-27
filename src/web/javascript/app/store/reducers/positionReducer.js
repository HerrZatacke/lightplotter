const positionReducer = (value = { x: 250, y: 700 }, action) => {
  switch (action.type) {
    case 'SET_POSITION':
      return {
        x: Math.ceil(action.position.x),
        y: Math.ceil(action.position.y),
      };
    default:
      return value;
  }
};

export default positionReducer;
