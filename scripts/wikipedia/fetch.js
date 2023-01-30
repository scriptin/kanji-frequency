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

const API_URL = 'https://ja.wikipedia.org/w/api.php';

async function run() {
  let continueParams = {};

  const reporter = new ConsoleReporter(
    'Downloaded contents of {COUNT}/{TOTAL} articles, {PERCENT}%...',
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
      const fileName = `${pageId}.txt`;
      if (fetchedArticles.includes(fileName)) {
        console.warn(`Already fetched article with id=${pageId}, skipping`);
        continue;
      }

      const { title, text } = getTitleAndText(pages[pageId]);
      if (!title || !text) continue;

      const filePath = join(__dirname, DATA_CLEAN_DIR, fileName);
      writeFileSync(filePath, [title, text].join('\n'), { encoding: 'utf-8' });
      fetchedArticles.push(fileName);

      reporter.update();
    }
  }
}

run();
