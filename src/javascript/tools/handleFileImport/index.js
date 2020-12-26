const tmpSVG = document.createElement('svg');
document.body.appendChild(tmpSVG);

const handleFileImport = (file) => (
  new Promise((resolve, reject) => {

    // roughly larger than 1MB is too much....
    if (file.size > 0xfffff) {
      reject(new Error('File too large'));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = (ev) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(ev.target.result, 'text/xml');
      const paths = [...doc.querySelectorAll('path')];

      paths.forEach((path) => {
        tmpSVG.appendChild(path);
      });

      if (!paths || !paths.length) {
        reject(new Error('no paths/invalid svg'));
      } else {
        resolve(paths);
      }

      // const light = document.querySelector('.nacelle__light');
      //
      // light.setAttribute('r', '0');
      // light.style.fill = '#000';
      //
      // const moveToNextPoint = (points) => {
      //   const point = points.pop();
      //   if (point === undefined) {
      //     light.setAttribute('r', '0');
      //     light.style.fill = '#000';
      //     return;
      //   }
      //
      //   light.setAttribute('r', Math.ceil((point.width / 2) + 2).toString(10));
      //   light.style.fill = point.color;
      //
      //   store.dispatch({
      //     type: 'SET_POSITION',
      //     position: point,
      //   });
      //
      //   window.setTimeout(() => {
      //     moveToNextPoint(points);
      //   }, 2.5);
      // };
      //
      // window.setTimeout(() => {
      //   moveToNextPoint(allPoints);
      // }, 2000);

      /**/

    };

    reader.readAsText(file);
  })
    .then((paths) => (
      paths.map((path) => {
        const r = (parseInt(window.getComputedStyle(path).strokeWidth, 10) || 4) / 2;
        const color = window.getComputedStyle(path).stroke || '#f00';
        return (
          Array(Math.ceil(path.getTotalLength()))
            .fill(null)
            .map((_, index) => {

              // if (index % 5) {
              //   return null;
              // }

              const { x, y } = path.getPointAtLength(index);
              return {
                x,
                y,
                r,
                color,
              };
            })
            .filter(Boolean)
        );
      })
    )
      .flat())
);

export default handleFileImport;
