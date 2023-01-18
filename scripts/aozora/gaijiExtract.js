const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const {
  DATA_DIR,
  GAIJI_FILE,
  GAIJI_IMG_ALL_REGEX,
  getGaijiAlt,
  getGaijiSrc,
} = require('./common');
const { ConsoleReporter } = require('../reporter');

function run() {
  const files = readdirSync(join(__dirname, DATA_DIR)).filter(
    (f) => f.endsWith('.txt') && !f.endsWith('.skip.txt'),
  );

  const reporter = new ConsoleReporter(
    'Processed contents of {COUNT}/{TOTAL} files, {PERCENT}%...',
    files.length,
    1000,
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

    reporter.report(
      index + 1,
      () => `Found ${images.size} unique gaiji images...`,
    );
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
