#!/usr/bin/env node
// Downloads all the favicons from each source and places them under the
// ../dist/assets/favicons folder
const { normalize, join, parse } = require('path');
const fs = require('fs');
const axios = require('axios');
const mime = require('mime');
const mkdirp = require('mkdirp');
const data = require('../src/data');
const { valueSeq } = require('../src/utils');

const favicons = valueSeq(data).map(({ type, faviconURL }) => ({
  type,
  faviconURL,
}));

const faviDir = join(
  normalize(join(parse(__filename).dir, '..')),
  'dist',
  'assets',
  'favicons',
);

// TODO: Finish this as a Promise
favicons.forEach(({ type, faviconURL }) => {
  axios.get(faviconURL, {
    responseType: 'stream',
  })
    .then(response => {
      const ext = mime.extension(response.headers['content-type']);
      const fileName = `${type}.${ext}`;
      const destPath = join(faviDir, fileName);
      mkdirp(faviDir, err => {
        if (err) throw err;
        // Only writing if favicon !exist
        if (fs.existsSync(fileName)) {
          const writeStream = fs.createWriteStream(destPath);
          // writeStream.on('open', () => console.log(`Writing ${fileName}...`));
          writeStream.on('finish', () => console.log(`Finished writing ${destPath}`));
          writeStream.on('error', (e) => { throw e; });
          response.data.pipe(writeStream);
        } else {
          console.log(`Skipping ${fileName}...`);
        }
      });
    });
});
