let startTime = null;

const animationRunningReducer = (animationRunning = false, action) => {
  let newVal;

  switch (action.type) {
    case 'SERVER_MESSAGE':
      newVal = action.isRunning !== undefined ? action.isRunning : animationRunning;

      if (animationRunning !== newVal) {
        if (newVal === true) {
          startTime = (new Date()).getTime();
        } else {
          // eslint-disable-next-line no-console
          console.info((new Date()).getTime() - startTime);
        }
      }

      return newVal;
    default:
      return animationRunning;
  }
};

export default animationRunningReducer;
