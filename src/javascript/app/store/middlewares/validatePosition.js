import calculateStats from '../../../tools/calculateStats';

const validatePosition = (store) => (next) => (action) => {

  if (action.type === 'SET_POSITION') {
    const state = store.getState();
    const stats = calculateStats(action.position, state.params);

    if (
      stats.al > 87 ||
      stats.ar > 87 ||
      stats.al < 4 ||
      stats.ar < 4 ||
      stats.tr > 1 || // Max Torque 1Nm
      stats.tl > 1 || // Max Torque 1Nm
      action.position.y + 50 > state.params.height
    ) {
      return;
    }

  }

  next(action);
};

export default validatePosition;
