const { readdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const { DATA_CLEAN_DIR, MAX_UNIQUE_ARTICLES } = require('./constants');
const { ConsoleReporter } = require('../reporter');

const API_URL = 'https://ja.wikipedia.org/w/api.php';

// https://www.mediawiki.org/wiki/API:Etiquette
const USER_AGENT =
  'KanjiFrequencyBot/2.0 (https://github.com/scriptin/kanji-frequency)';

function getQuery(continueParams) {
  // https://www.mediawiki.org/wiki/API:Query
  const queryParams = new URLSearchParams();
  queryParams.set('action', 'query');
  queryParams.set('maxlag', '5'); // https://www.mediawiki.org/wiki/Manual:Maxlag_parameter
  queryParams.set('format', 'json');
  queryParams.set('generator', 'random');
  queryParams.set('grnnamespace', '0'); // articles only
  queryParams.set('grnlimit', '1'); // only 1 because TextExtracts only supports 1 at a time
  queryParams.set('prop', 'extracts'); // https://www.mediawiki.org/wiki/Extension:TextExtracts
  queryParams.set('explaintext', 'true');
  for (const param of Object.keys(continueParams)) {
    queryParams.set(param, continueParams[param]);
  }

  return queryParams;
}

async function fetchWithContinue(continueParams) {
  return fetch(API_URL + '?' + getQuery(continueParams).toString(), {
    method: 'GET',
    headers: new Headers({
      'User-Agent': USER_AGENT,
    }),
  });
}

function getFetchedArticles() {
  const cleanDataDirPath = join(__dirname, DATA_CLEAN_DIR);
  return readdirSync(cleanDataDirPath);
}

async function run() {
  let continueParams = {};

  const reporter = new ConsoleReporter(
    'Downloaded contents of {COUNT}/{TOTAL} articles, {PERCENT}%...',
    50,
    MAX_UNIQUE_ARTICLES,
  );

  let fetchedArticles = getFetchedArticles();
  reporter.setCount(fetchedArticles.length);

  while (fetchedArticles.length <= MAX_UNIQUE_ARTICLES) {
    const result = await fetchWithContinue(continueParams);
    const json = await result.json();
    if (json.error) {
      console.error('API request failed:');
      console.error(JSON.stringify(json.error, null, '  '));
      process.exit(1);
    }
    continueParams = json.continue ?? {};

    const pages = json.query?.pages;
    if (!pages) {
      console.error('Response has no "query.pages" field');
      console.error(JSON.stringify(json, null, '  '));
    }

    for (const pageId of Object.keys(pages)) {
      const fileName = `${pageId}.txt`;
      if (fetchedArticles.includes(fileName)) {
        console.warn(`Already fetched article with id=${pageId}, skipping`);
        continue;
      }

      const title = pages[pageId].title;
      if (!title) {
        console.error('Page has no "title" field:');
        console.error(JSON.stringify(pages[pageId], null, '  '));
        continue;
      }

      const text = pages[pageId].extract;
      if (!text) {
        console.error('Page has no "extract" field:');
        console.error(JSON.stringify(pages[pageId], null, '  '));
        continue;
      }

      const filePath = join(__dirname, DATA_CLEAN_DIR, fileName);
      writeFileSync(filePath, [title, text].join('\n'), { encoding: 'utf-8' });
      fetchedArticles.push(fileName);

      reporter.update();
    }
  }
}

run();
