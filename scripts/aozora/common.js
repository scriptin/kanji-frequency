const BASE_URL = 'https://www.aozora.gr.jp/';

function percent(value, total) {
  return ((100 * value) / total).toFixed(2);
}

const GAIJI_IMG_REGEX = /<img[^>]*?gaiji[^>]*?\/?>/i;
const GAIJI_IMG_ALL_REGEX = /<img[^>]*?gaiji[^>]*?\/?>/gi;
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

module.exports = {
  BASE_URL,
  // paths are relative
  PAGES_URLS_FILE: 'pages.csv',
  PAGES_FILES_DIR: 'pages',
  PAGES_FILES_CLEAN_DIR: 'pages_clean',
  GAIJI_FILE: 'gaiji.csv',
  GAIJI_REPLACEMENTS_FILE: 'gaiji_replacements.csv',
  percent,
  GAIJI_IMG_REGEX,
  GAIJI_IMG_ALL_REGEX,
  ALT_ATTR_REGEX,
  SRC_ATTR_REGEX,
  getGaijiAlt,
  getGaijiSrc,
};
