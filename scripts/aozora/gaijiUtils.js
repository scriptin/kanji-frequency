const { BASE_URL } = require('./constants');

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
  GAIJI_IMG_ALL_REGEX,
  getGaijiAlt,
  getGaijiSrc,
};
