import calculateStats from '../../../tools/calculateStats';

const validatePosition = (store) => (next) => (action) => {

  if (action.type === 'SET_POSITION') {
    const state = store.getState();
    const stats = calculateStats(action.position, state.params);


    // hard caps
    if (
      stats.al >= 90 ||
      stats.ar >= 90 ||
      stats.al <= 0 ||
      stats.ar <= 0 ||
      action.position.y + 100 > state.params.height
    ) {
      return;
    }

    const warnings = [];

    // soft caps (shows warning)
    if (stats.al < 4) {
      warnings.push('al');
    }

    if (stats.ar < 4) {
      warnings.push('ar');
    }

    if (stats.tr > 1) { // Max Torque 1Nm
      warnings.push('tr');
    }

    if (stats.tl > 1) { // Max Torque 1Nm
      warnings.push('tl');
    }

    if (stats.fl > 100) {
      warnings.push('fl');
    }

    if (stats.fr > 100) {
      warnings.push('fr');
    }

    Object.assign(action, { warnings });
  }

  next(action);
};

export default validatePosition;
