const positionReducer = (position = { x: 600, y: 600 }, action) => {
  switch (action.type) {
    case 'SET_POSITION':
      return {
        x: Math.ceil(action.position.x),
        y: Math.ceil(action.position.y),
      };
    case 'SERVER_MESSAGE':
      return action.point !== undefined ? action.point : position;
    default:
      return position;
  }
};

export default positionReducer;
