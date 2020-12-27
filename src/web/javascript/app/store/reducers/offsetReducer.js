const offsetReducer = (offset = 0, action) => {
  switch (action.type) {
    case 'SET_OFFSET':
      return action.offset;
    case 'SERVER_MESSAGE':
      return action.offset !== undefined ? action.offset : offset;
    default:
      return offset;
  }
};

export default offsetReducer;
