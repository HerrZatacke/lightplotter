const updateParams = (store) => (next) => (action) => {

  if (action.type === 'UPDATE_PARAM') {
    const { params } = store.getState();

    // eslint-disable-next-line no-alert
    const newValue = window.prompt(action.paramKey, params[action.paramKey]) || params[action.paramKey];

    store.dispatch({
      type: 'UPDATE_PARAMS',
      params: {
        [action.paramKey]: parseFloat(newValue),
      },
    });

    return;
  }

  next(action);
};

export default updateParams;
