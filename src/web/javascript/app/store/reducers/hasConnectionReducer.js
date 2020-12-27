const hasConnectionReducer = (hasConnection = false, action) => {
  switch (action.type) {
    case 'SET_HAS_CONNECTION':
      return action.hasConnection;
    default:
      return hasConnection;
  }
};

export default hasConnectionReducer;
