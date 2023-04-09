const shapefile = require('shapefile')

function readFile(e) {
  const files = e.currentTarget.files;
  const promises = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const extension = getExtension(file.name);

    if (extension === 'shp') {
      const promise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const shpData = reader.result;
          const dbfPromise = getDbfData(files[i + 1]);

          dbfPromise.then((dbfData) => {
            shapefile
              .open(shpData, dbfData)
              .then((source) => {
                const data = [];

                source.read().then(function log(result) {
                  if (result.done) {
                    resolve(data);
                    return;
                  }

                  data.push(result.value);
                  return source.read().then(log);
                });
              })
              .catch(reject);
          });
        };

        reader.readAsArrayBuffer(file);
      });

      promises.push(promise);
    }
  }

  return Promise.all(promises).then((data) => data.flat());
}

function getDbfData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const extension = getExtension(file.name);

    if (extension !== 'dbf') {
      reject(new Error('Expected a dbf file'));
      return;
    }

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.readAsArrayBuffer(file);
  });
}

function getExtension(filename) {
  return filename.split('.').pop();
}

export default readFile;

