
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

      if (!paths || !paths.length) {
        reject(new Error('no paths/invalid svg'));
      } else {
        resolve(paths);
      }
    };

    reader.readAsText(file);
  })
);

export default handleFileImport;
