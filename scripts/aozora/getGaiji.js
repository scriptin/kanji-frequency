const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const {
  BASE_URL,
  PAGES_FILES_DIR,
  percent,
  GAIJI_LIST_FILE,
} = require('./common');

const GAIJI_IMG_REGEX = /<img[^>]*?gaiji[^>]*?\/?>/i;
const SRC_ATTR_REGEX = /src="(.*?)"/i;
const ALT_ATTR_REGEX = /alt="(.*?)"/i;

function getGaijiAlt(imgHtml) {
  const altMatches = imgHtml.match(ALT_ATTR_REGEX);
  if (!altMatches || altMatches.length < 2) {
    throw new Error('Could not find alt attribute');
  }
  return altMatches[1].replace(/^※\(/, '').replace(/\)$/, '');
}

function getGaijiSrc(imgHtml) {
  const srcMatches = imgHtml.match(SRC_ATTR_REGEX);
  if (!srcMatches || srcMatches.length < 2) {
    throw new Error('Could not find src attribute');
  }
  const srcParts = srcMatches[1].split('/');
  const srcDir = srcParts[srcParts.length - 2];
  const srcFile = srcParts[srcParts.length - 1];
  return `${BASE_URL}gaiji/${srcDir}/${srcFile}`;
}

function run() {
  const files = readdirSync(join(__dirname, PAGES_FILES_DIR)).filter(
    (f) => f.endsWith('.txt') && !f.endsWith('.skip.txt'),
  );

  const images = new Set();
  for (const [index, file] of files.entries()) {
    if (file.endsWith('.skip.txt') || !file.endsWith('.txt')) continue;

    const contents = readFileSync(join(__dirname, PAGES_FILES_DIR, file), {
      encoding: 'utf-8',
    });
    const matches = contents.match(GAIJI_IMG_REGEX);
    if (matches) {
      matches.forEach((m) => images.add(m));
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
  writeFileSync(join(__dirname, GAIJI_LIST_FILE), gaijiList.join('\n'), {
    encoding: 'utf-8',
  });
}

run();
