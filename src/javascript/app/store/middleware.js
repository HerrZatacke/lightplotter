import calculateStats from '../../tools/calculateStats';

const middleware = (store) => (next) => (action) => {

  if (action.type === 'SET_POSITION') {
    const state = store.getState();
    const stats = calculateStats(action.position, state.params);

    if (
      stats.al > 87 ||
      stats.ar > 87 ||
      stats.al < 10 ||
      stats.ar < 10 ||
      action.position.y + 50 > state.params.height
    ) {
      return;
    }

  }

  next(action);
};

export default middleware;
