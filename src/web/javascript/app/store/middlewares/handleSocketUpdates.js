
const handleSocketUpdates = ({ dispatch }) => {
  const socket = new WebSocket(`ws://${window.location.hostname}:3001/writer`);

  socket.addEventListener('close', () => {
    dispatch({
      type: 'SET_HAS_CONNECTION',
      hasConnection: false,
    });
  });

  socket.addEventListener('open', () => {
    dispatch({
      type: 'SET_HAS_CONNECTION',
      hasConnection: true,
    });
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);

    if (message.offset !== undefined) {
      dispatch({
        type: 'SET_OFFSET',
        payload: message.offset,
      });
    }

    if (message.canAcceptNewImage !== undefined) {
      dispatch({
        type: 'SET_SERVER_BUSY',
        payload: !message.canAcceptNewImage,
      });
    }

    if (message.isRunning !== undefined) {
      dispatch({
        type: 'SET_ANIMATION_RUNNING',
        payload: message.isRunning,
      });
    }
  });

  return (next) => (action) => {

    switch (action.type) {
      case 'SEND_START':
        socket.send(JSON.stringify({ start: true }));
        break;
      case 'SEND_STOP':
        socket.send(JSON.stringify({ stop: true }));
        break;
      default:
        break;
    }

    return next(action);
  };
};

export default handleSocketUpdates;
