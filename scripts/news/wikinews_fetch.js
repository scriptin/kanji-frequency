const { readdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const { DATA_CLEAN_DIR, MAX_UNIQUE_ARTICLES } = require('./constants');
const { ConsoleReporter } = require('../reporter');
const {
  fetchWithContinue,
  getContinueParams,
  getPagesOrStop,
  getTitleAndText,
} = require('../wiki');

const API_URL = 'https://ja.wikinews.org/w/api.php';

const DATE_REGEX = /^【(\d{4})年(\d{1,2})月(\d{1,2})日】/;

function getDate(text, pageId) {
  const dateMatch = text.match(DATE_REGEX);
  if (!dateMatch) {
    console.warn(`No matching date found in article with id=${pageId}:`);
    const textClean = text.replaceAll('\n', ' ');
    const firstWords = Array.from(textClean).slice(0, 30);
    console.warn(firstWords.join('') + ' ...');
    return false;
  }

  const [_, year, month, day] = dateMatch;
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

async function run() {
  let continueParams = {};

  const reporter = new ConsoleReporter(
    'Downloaded contents of {COUNT}/{TOTAL} news articles, {PERCENT}%...',
    50,
    MAX_UNIQUE_ARTICLES,
  );

  const fetchedArticles = readdirSync(join(__dirname, DATA_CLEAN_DIR));
  reporter.setCount(fetchedArticles.length);

  while (fetchedArticles.length <= MAX_UNIQUE_ARTICLES) {
    const json = await fetchWithContinue(API_URL, continueParams);
    continueParams = getContinueParams(json);

    const pages = getPagesOrStop(json);
    for (const pageId of Object.keys(pages)) {
      const { title, text } = getTitleAndText(pages[pageId]);
      if (!title || !text) continue;

      const date = getDate(text, pageId);
      if (!date) continue;

      const textClean = text.replace(DATE_REGEX, '');

      const fileName = `wikinews-${pageId}-${date}.txt`;
      if (fetchedArticles.includes(fileName)) {
        console.warn(`Already fetched article with id=${pageId}, skipping`);
        continue;
      }

      const filePath = join(__dirname, DATA_CLEAN_DIR, fileName);
      writeFileSync(filePath, [title, textClean].join('\n'), {
        encoding: 'utf-8',
      });
      fetchedArticles.push(fileName);

      reporter.update();
    }
  }
}

run();
