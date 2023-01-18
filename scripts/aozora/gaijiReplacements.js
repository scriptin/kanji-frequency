const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const { GAIJI_REPLACEMENTS_FILE } = require('./constants');

GAIJI_CODE_REGEX = /\d-\d{1,2}-\d{1,2}/g;
function getGaijiCodes(alt, src) {
  const altCodes = alt.matchAll(GAIJI_CODE_REGEX);
  const srcCode = src.match(GAIJI_CODE_REGEX);
  return [...altCodes, srcCode[0]];
}

function run() {
  const gaijiChukiFilePath = join(__dirname, 'gaiji_chuki.txt');
  const gaijiChukiLines = readFileSync(gaijiChukiFilePath, {
    encoding: 'utf-8',
  }).split('\n');

  const replacementsFilePath = join(__dirname, GAIJI_REPLACEMENTS_FILE);
  const replacements = readFileSync(replacementsFilePath, {
    encoding: 'utf-8',
  })
    .split('\n')
    .map((r) => {
      const parts = r.split(',').map((part) => part.trim());
      if (parts[0] === '') {
        parts.shift();
      }
      return parts;
    });

  for (let i = 0; i < replacements.length; i++) {
    const replacement = replacements[i];
    if (!replacement || replacement.length === 0) continue;
    if (replacement.length < 3) {
      const [src, alt] = replacement;
      const codes = getGaijiCodes(alt, src);
      const candidateLine = gaijiChukiLines.find((line) =>
        codes.some((code) => line.includes(code)),
      );
      if (!candidateLine) {
        replacements[i].unshift('');
        continue;
      }
      const matches = candidateLine.match(/\s*(.)\s*※\s*［/i);
      if (!matches || matches.length < 2) {
        replacements[i].unshift('');
        continue;
      }
      console.log(`Found replacement ${matches[1]} for ${src}, ${alt}`);
      replacements[i].unshift(matches[1]);
    }
  }

  writeFileSync(
    replacementsFilePath,
    replacements.map((r) => r.join(',')).join('\n'),
    { encoding: 'utf-8' },
  );
}

run();
