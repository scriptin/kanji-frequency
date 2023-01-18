const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const puppeteer = require('puppeteer');

const { BASE_URL, PAGES_URLS_FILE, DATA_DIR } = require('./common');
const { percent } = require('../reporter');

const PAGES_FILE_PATH = join(__dirname, PAGES_URLS_FILE);

function pause(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function getNextPageUrl(page) {
  return page.evaluate(() => {
    const link = document.querySelector('h1 + center table td:nth-child(3) a');
    return link?.href ?? null;
  });
}

/**
 * Get book contents (separated with '\n'):
 * - title
 * - author name
 * - text - HTML
 *
 * @param {import('puppeteer').Page} page
 * @param {string} bookPageUrl
 * @returns {Promise<string|null>} Returns `null` then there is no link, or it's a non-aozora link
 */
async function getBookText(page, bookPageUrl) {
  await page.goto(bookPageUrl);
  const htmlVersionUrl = await page.evaluate(() => {
    const link = document.querySelector('hr + div a:nth-child(2)');
    return link?.href ?? null;
  });

  if (!htmlVersionUrl) return null;
  if (!htmlVersionUrl.toLowerCase().startsWith(BASE_URL)) return null;

  await page.goto(htmlVersionUrl);

  return page.evaluate(() => {
    const title = document.querySelector('.title');
    const author = document.querySelector('.author');
    const text = document.querySelector('.main_text');
    return [title, author, text]
      .map((el) => (el ? el.innerHTML : ''))
      .join('\n');
  });
}

function shouldAbortUrl(url) {
  const u = url.toLowerCase();
  return (
    u.endsWith('.png') ||
    u.endsWith('.jpg') ||
    u.endsWith('.jpeg') ||
    u.endsWith('.gif') ||
    u.endsWith('.js') ||
    u.endsWith('.css') ||
    !u.startsWith(BASE_URL)
  );
}

async function setRequestInterceptionFilter(page) {
  await page.setRequestInterception(true);
  page.on('request', (interceptedRequest) => {
    if (interceptedRequest.isInterceptResolutionHandled()) return;
    if (shouldAbortUrl(interceptedRequest.url())) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });
}

async function getIndexUrls(page) {
  await page.goto(BASE_URL);
  // await page.waitForSelector('[summary="作品リスト"]');
  return page.evaluate(() => {
    return [
      ...document.querySelectorAll('[summary="作品リスト"] tbody td a'),
    ].map((anchor) => [anchor.textContent.trim(), anchor.href]);
  });
}

async function isNotFound(page) {
  return page.evaluate(() => !!document.querySelector('input[value="戻る"]'));
}

async function getBookUrlsFromCurrentPage(page) {
  return page.evaluate(() => {
    return [...document.querySelectorAll('a[href*="cards"]')].map(
      (anchor) => anchor.href,
    );
  });
}

async function collectBookPagesUrls(page, indexUrls) {
  const urls = [];
  for (const [indexCharacter, indexUrl] of indexUrls) {
    console.log(`Getting the list of pages for ${indexCharacter}...`);
    await page.goto(indexUrl);
    const notFound = await isNotFound(page);
    if (notFound) continue;
    while (true) {
      const newUrls = await getBookUrlsFromCurrentPage(page);
      urls.push(...newUrls);
      console.log(`Got +${newUrls.length} URLs, ${urls.length} total`);
      const nextPageUrl = await getNextPageUrl(page);
      if (nextPageUrl) {
        await page.goto(nextPageUrl);
      } else {
        break;
      }
    }
    // await pause(100);
  }

  console.log(`Collected ${urls.length} URLs`);
  writeFileSync(PAGES_FILE_PATH, urls.join('\n'), {
    encoding: 'utf-8',
  });

  return urls;
}

async function getBookPagesUrls(page) {
  if (existsSync(PAGES_FILE_PATH)) {
    const urlsFromFile = readFileSync(PAGES_FILE_PATH, {
      encoding: 'utf-8',
    }).split('\n');
    console.log(`Read ${urlsFromFile.length} URLs from ${PAGES_FILE_PATH}`);
    return urlsFromFile;
  }

  const indexUrls = await getIndexUrls(page);
  return collectBookPagesUrls(page, indexUrls);
}

function getFilePathForBookUrl(bookUrl) {
  const linkParts = bookUrl.split('/');
  const fileName = [
    linkParts[linkParts.length - 2],
    linkParts[linkParts.length - 1].replace(/html$/i, 'txt'),
  ].join('_');
  return join(__dirname, DATA_DIR, fileName);
}

async function downloadBookContents(page, bookUrls) {
  let bookUrlsProcessed = 0;
  for (const bookUrl of bookUrls) {
    const filePath = getFilePathForBookUrl(bookUrl);
    const skippedFilePath = filePath.replace(/\.txt$/, '.skip.txt');

    if (!existsSync(filePath) && !existsSync(skippedFilePath)) {
      const contents = await getBookText(page, bookUrl);
      if (contents) {
        writeFileSync(filePath, contents, {
          encoding: 'utf-8',
        });
      } else {
        // Create a dummy file to prevent re-downloading attempts
        writeFileSync(skippedFilePath, '!', {
          encoding: 'utf-8',
        });
      }
    }

    bookUrlsProcessed += 1;

    if (bookUrlsProcessed % 10 === 0) {
      const pct = percent(bookUrlsProcessed, bookUrls.length);
      console.log(
        `Downloaded contents of ${bookUrlsProcessed}/${bookUrls.length} URLs, ${pct}%...`,
      );
      // await pause(100);
    }
  }
}

async function run() {
  const browser = await puppeteer.launch({ product: 'chrome' });
  const page = await browser.newPage();
  await setRequestInterceptionFilter(page);

  const bookUrls = await getBookPagesUrls(page);
  await downloadBookContents(page, bookUrls);

  await browser.close();
}

run();
