import defaultParams from '../../../tools/defaultParams/index.json';

const toDefault = (dispatch) => {
  dispatch({
    type: 'SET_HAS_CONNECTION',
    hasConnection: false,
  });

  dispatch({
    type: 'UPDATE_PARAMS',
    params: defaultParams,
  });
};

const handleSocketUpdates = (store) => {

  const { dispatch } = store;

  if (window.location.protocol === 'https:') {
    window.setTimeout(() => {
      toDefault(dispatch);
    }, 250);

    return (next) => (action) => {
      next(action);
    };
  }

  const socket = new WebSocket(`ws://${window.location.hostname}:3001/writer`);

  socket.addEventListener('close', () => {
    toDefault(dispatch);
  });

  socket.addEventListener('open', () => {
    dispatch({
      type: 'SET_HAS_CONNECTION',
      hasConnection: true,
    });
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);

    dispatch({
      type: 'SERVER_MESSAGE',
      ...message,
    });
  });

  return (next) => (action) => {

    switch (action.type) {
      case 'SEND_START':
        socket.send(JSON.stringify({ start: true }));
        break;
      case 'SEND_STOP':
        socket.send(JSON.stringify({ stop: true }));
        break;
      case 'SEND_POINTS':
        socket.send(JSON.stringify({ points: action.points }));
        break;
      case 'SEND_PARAM':
        socket.send(JSON.stringify({
          params: action.params,
        }));
        break;
      default:
        break;
    }

    next(action);
  };
};

export default handleSocketUpdates;
