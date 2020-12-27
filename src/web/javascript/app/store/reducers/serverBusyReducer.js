const serverBusyReducer = (serverBusy = false, action) => {
  switch (action.type) {
    case 'SET_SERVER_BUSY':
      return action.serverBusy;
    default:
      return serverBusy;
  }
};

export default serverBusyReducer;
