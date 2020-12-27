const serverBusyReducer = (serverBusy = false, action) => {
  switch (action.type) {
    case 'SERVER_MESSAGE':
      return action.canAcceptNewImage !== undefined ? !action.canAcceptNewImage : serverBusy;
    default:
      return serverBusy;
  }
};

export default serverBusyReducer;
