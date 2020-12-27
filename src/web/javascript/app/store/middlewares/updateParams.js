const updateParams = (store) => (next) => (action) => {

  if (action.type === 'UPDATE_PARAM') {
    const { params, hasConnection } = store.getState();

    // eslint-disable-next-line no-alert
    const newValue = window.prompt(action.paramKey, params[action.paramKey]) || params[action.paramKey];


    if (hasConnection) {
      store.dispatch({
        type: 'SEND_PARAM',
        params: {
          [action.paramKey]: parseFloat(newValue),
        },
      });
    }


    return;
  }

  next(action);
};

export default updateParams;
