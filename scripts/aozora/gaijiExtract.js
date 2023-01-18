const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const {
  DATA_DIR,
  GAIJI_FILE,
  GAIJI_IMG_ALL_REGEX,
  getGaijiAlt,
  getGaijiSrc,
} = require('./common');
const { percent } = require('../reporter');

function run() {
  const files = readdirSync(join(__dirname, DATA_DIR)).filter(
    (f) => f.endsWith('.txt') && !f.endsWith('.skip.txt'),
  );

  const images = new Set();
  for (const [index, file] of files.entries()) {
    if (file.endsWith('.skip.txt') || !file.endsWith('.txt')) continue;

    const contents = readFileSync(join(__dirname, DATA_DIR, file), {
      encoding: 'utf-8',
    });
    for (const matches of contents.matchAll(GAIJI_IMG_ALL_REGEX)) {
      if (matches) {
        matches.forEach((m) => images.add(m));
      }
    }
    if ((index + 1) % 1000 === 0) {
      const pct = percent(index + 1, files.length);
      console.log(
        `Processed contents of ${index + 1}/${files.length} files, ${pct}%...`,
      );
      console.log(`Found ${images.size} unique gaiji images`);
    }
  }
  console.log(`Found total ${images.size} unique gaiji images`);

  const alts = new Set();
  images.forEach((i) => {
    alts.add([getGaijiSrc(i), getGaijiAlt(i)].join(','));
  });
  console.log(`Found ${alts.size} unique gaiji src/alt attributes`);

  const gaijiList = [];
  alts.forEach((v) => gaijiList.push(v));
  writeFileSync(join(__dirname, GAIJI_FILE), gaijiList.join('\n'), {
    encoding: 'utf-8',
  });
}

run();
