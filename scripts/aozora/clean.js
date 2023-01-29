const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const {
  DATA_DIR,
  DATA_CLEAN_DIR,
  GAIJI_REPLACEMENTS_FILE,
} = require('./constants');
const {
  GAIJI_IMG_ALL_REGEX,
  getGaijiAlt,
  getGaijiSrc,
} = require('./gaijiUtils');
const { ConsoleReporter } = require('../reporter');

function replaceGaiji(text, gaijiReplacements) {
  let result = text;
  for (const matches of text.matchAll(GAIJI_IMG_ALL_REGEX)) {
    const alt = getGaijiAlt(matches[0]);
    const src = getGaijiSrc(matches[0]);
    const replacementData = gaijiReplacements.find(
      ([_, replUrl, replAlt]) => replUrl === src && alt.includes(replAlt),
    );
    if (!replacementData) {
      throw new Error(`Not found replacement for gaiji: ${matches[0]}`);
    }
    result = result.replace(matches[0], replacementData[0]);
  }
  return result;
}

const OPEN_TAG_REGEX = /<\w+[^>]*>/gi;
const CLOSE_TAG_REGEX = /<\/\w+>/gi;
const SELF_CLOSE_TAG_REGEX = /<\w+[^>]*\/>/gi;

function removeTags(text) {
  return text
    .replace(OPEN_TAG_REGEX, '')
    .replace(CLOSE_TAG_REGEX, '')
    .replace(SELF_CLOSE_TAG_REGEX, '');
}

function validateGaijiReplacements(gaijiReplacements) {
  const invalidGaijiIndex = gaijiReplacements.findIndex(
    (r) => r.length < 3 || !r[0],
  );
  if (invalidGaijiIndex > -1) {
    throw new Error(
      `Invalid replacement format at line ${invalidGaijiIndex + 1}: ${
        gaijiReplacements[invalidGaijiIndex]
      }`,
    );
  }
}

function run() {
  const gaijiReplacementsFilePath = join(__dirname, GAIJI_REPLACEMENTS_FILE);
  const gaijiReplacements = readFileSync(gaijiReplacementsFilePath, {
    encoding: 'utf-8',
  })
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => line.split(',')); // empty line at the end

  validateGaijiReplacements(gaijiReplacements);

  const srcPath = join(__dirname, DATA_DIR);
  const dstPath = join(__dirname, DATA_CLEAN_DIR);
  const srcFiles = readdirSync(srcPath).filter(
    (f) => f.endsWith('.txt') && !f.endsWith('.skip.txt'),
  );

  const reporter = new ConsoleReporter(
    'Cleaned contents of {COUNT}/{TOTAL} files, {PERCENT}%...',
    1000,
    srcFiles.length,
  );

  for (const srcFileName of srcFiles) {
    const contents = readFileSync(join(srcPath, srcFileName), {
      encoding: 'utf-8',
    });
    const cleanContents = removeTags(replaceGaiji(contents, gaijiReplacements));
    const dstFilePath = join(dstPath, srcFileName);
    writeFileSync(dstFilePath, cleanContents, { encoding: 'utf-8' });

    reporter.update();
  }

  console.log(`Cleaned total ${srcFiles.length} files`);
}

run();
