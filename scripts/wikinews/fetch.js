const { existsSync, readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const {
  DATA_CLEAN_DIR,
  DATES_FILE,
  MAX_UNIQUE_ARTICLES,
} = require('./constants');
const { ConsoleReporter } = require('../reporter');
const {
  fetchWithContinue,
  getContinueParams,
  getPagesOrStop,
  getTitleAndText,
} = require('../wiki');

const API_URL = 'https://ja.wikinews.org/w/api.php';

const DATE_REGEX = /^【(\d{4})年(\d{1,2})月(\d{1,2})日】/;

function getDateCounts() {
  const datesFilePath = join(__dirname, DATES_FILE);
  if (!existsSync(datesFilePath)) return [];

  const contents = readFileSync(datesFilePath, {
    encoding: 'utf-8',
  });

  return contents
    .split('\n')
    .filter((line) => !!line)
    .map((line) => {
      const [date, count] = line.split(',');
      return [date, Number.parseInt(count, 10)];
    });
}

function saveDateCounts(dateCounts) {
  writeFileSync(
    join(__dirname, DATES_FILE),
    dateCounts.map((row) => row.join(',')).join('\n'),
    { encoding: 'utf-8' },
  );
}

function handleDate(text, title, pageId, dateCounts) {
  const dateMatch = text.match(DATE_REGEX);
  if (!dateMatch) {
    console.warn(
      `No matching date found in article "${title}" (id=${pageId}):`,
    );
    const textClean = text.replaceAll('\n', ' ');
    const firstWords = Array.from(textClean).slice(0, 30);
    console.warn(firstWords.join('') + ' ...');
    return false;
  }

  const [_, year, month, day] = dateMatch;
  const dateFormatted = [
    year,
    month.padStart(2, '0'),
    day.padStart(2, '0'),
  ].join('-');

  const dateIndex = dateCounts.findIndex(([date]) => date === dateFormatted);
  if (dateIndex === -1) {
    dateCounts.push([dateFormatted, 1]);
  } else {
    dateCounts[dateIndex][1] += 1;
  }
  dateCounts.sort((a, b) => (a[0] < b[0] ? 1 : -1));
  saveDateCounts(dateCounts);

  return true;
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

  const dateCounts = getDateCounts();

  while (fetchedArticles.length <= MAX_UNIQUE_ARTICLES) {
    const json = await fetchWithContinue(API_URL, continueParams);
    continueParams = getContinueParams(json);

    const pages = getPagesOrStop(json);
    for (const pageId of Object.keys(pages)) {
      const fileName = `${pageId}.txt`;
      if (fetchedArticles.includes(fileName)) {
        console.warn(
          `Already fetched news article with id=${pageId}, skipping`,
        );
        continue;
      }

      const { title, text } = getTitleAndText(pages[pageId]);
      if (!title || !text) continue;

      if (!handleDate(text, title, pageId, dateCounts)) {
        continue;
      }

      const textClean = text.replace(DATE_REGEX, '');

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
