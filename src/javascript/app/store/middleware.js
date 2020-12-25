import calculateStats from '../../tools/calculateStats';

const middleware = (store) => (next) => (action) => {

  if (action.type === 'SET_POSITION') {
    const state = store.getState();
    const stats = calculateStats(action.position, state.params);

    if (
      stats.al > 87 ||
      stats.ar > 87 ||
      stats.al < 4 ||
      stats.ar < 4 ||
      action.position.y + 50 > state.params.height
    ) {
      return;
    }

  } else if (action.type === 'RUN') {

    const paths = [...document.querySelectorAll('.display__path path')];
    const light = document.querySelector('.nacelle__light');

    const allPoints = paths.map((path) => {
      const width = parseInt(window.getComputedStyle(path).strokeWidth, 10) || 4;
      const color = window.getComputedStyle(path).stroke || '#fff';
      return (
        Array(Math.ceil(path.getTotalLength()))
          .fill(null)
          .map((_, index) => {
            const { x, y } = path.getPointAtLength(index);
            return {
              x,
              y,
              width,
              color,
            };
          })
      );
    })
      .flat();

    light.setAttribute('r', '0');
    light.style.fill = '#000';
    document.querySelector('.display__path').style.display = 'none';

    const moveToNextPoint = (points) => {
      const point = points.pop();
      if (point === undefined) {
        light.setAttribute('r', '0');
        light.style.fill = '#000';

        window.setTimeout(() => {
          document.querySelector('.display__path').style.display = null;
          store.dispatch({
            type: 'SET_POSITION',
            position: { x: 250, y: 700 },
          });
        }, 2000);
        return;
      }

      light.setAttribute('r', Math.ceil((point.width / 2) + 2).toString(10));
      light.style.fill = point.color;

      store.dispatch({
        type: 'SET_POSITION',
        position: point,
      });

      window.setTimeout(() => {
        moveToNextPoint(points);
      }, 25);
    };

    window.setTimeout(() => {
      moveToNextPoint(allPoints);
    }, 2000);
  }

  next(action);
};

export default middleware;
