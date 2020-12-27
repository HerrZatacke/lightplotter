const positionReducer = (value = { x: 0, y: 0 }, action) => {
  switch (action.type) {
    case 'SET_POSITION':
      return {
        x: Math.ceil(action.position.x),
        y: Math.ceil(action.position.y),
      };
    case 'SET_OFFSET':
      return {
        x: action.point.x,
        y: action.point.y,
      };
    default:
      return value;
  }
};

export default positionReducer;
